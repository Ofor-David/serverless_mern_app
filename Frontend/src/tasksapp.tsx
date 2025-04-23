import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

const API_URL = "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api"; //replace with: {API Gateway endpoint}/api

interface Task {
  _id: string;
  text: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthError {
  field?: string;
  message: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [authFormData, setAuthFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUserProfile();
    }
  }, [token]);

  const clearMessages = () => {
    setErrors([]);
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: AuthError[] = [];

    if (!authFormData.email) {
      newErrors.push({ field: "email", message: "Email is required" });
    } else if (!/^\S+@\S+\.\S+$/.test(authFormData.email)) {
      newErrors.push({ field: "email", message: "Email is invalid" });
    }

    if (!authFormData.password) {
      newErrors.push({ field: "password", message: "Password is required" });
    } else if (authFormData.password.length < 6) {
      newErrors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (!isLogin) {
      if (!authFormData.name) {
        newErrors.push({ field: "name", message: "Name is required" });
      }

      if (!authFormData.confirmPassword) {
        newErrors.push({
          field: "confirmPassword",
          message: "Please confirm your password",
        });
      } else if (authFormData.password !== authFormData.confirmPassword) {
        newErrors.push({
          field: "confirmPassword",
          message: "Passwords do not match",
        });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    }
  };

  const fetchTaskById = async (id: string) => {
    try {
      const res = await axios.get<Task>(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSelectedTask(res.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error fetching task:",
        error.response?.data || error.message
      );
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get<User>(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error fetching user profile:",
        error.response?.data || error.message
      );
    }
  };

  const addTask = async () => {
    try {
      await axios.post(
        `${API_URL}/tasks`,
        { text: newTask },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setNewTask("");
      fetchTasks();
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error adding task:",
        error.response?.data || error.message
      );
    }
  };

  const updateTask = async (id: string, updatedText: string) => {
    try {
      await axios.put(
        `${API_URL}/tasks/${id}`,
        { text: updatedText },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error deleting task:",
        error.response?.data || error.message
      );
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) return;

    try {
      const endpoint = isLogin ? "login" : "register";
      const payload = isLogin
        ? {
            email: authFormData.email,
            password: authFormData.password,
          }
        : {
            name: authFormData.name,
            email: authFormData.email,
            password: authFormData.password,
          };

      const res = await axios.post(`${API_URL}/users/${endpoint}`, payload);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setSuccessMessage(
          isLogin ? "Login successful!" : "Registration successful!"
        );
        // Reset form after successful registration
        if (!isLogin) {
          setAuthFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } else {
        throw new Error("Invalid response: Token missing");
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorData = error.response?.data as {
        error?: string;
        message?: string;
      };

      let errorMessage = "An unexpected error occurred";

      // Handle specific error cases
      if (error.response?.status === 400) {
        if (!isLogin) {
          errorMessage = "User with this email already exists";
        } else {
          errorMessage = "Invalid email or password";
        }
      } else {
        errorMessage = errorData?.error || errorData?.message || errorMessage;
      }

      setErrors([{ message: errorMessage }]);
    }
  };

  const deleteUserAccount = async () => {
    try {
      await axios.delete(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      handleLogout();
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error deleting account:",
        error.response?.data || error.message
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setTasks([]);
    setSelectedTask(null);
    setIsLogin(true); // Always show login screen after logout
    clearMessages();
    // Reset form fields
    setAuthFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorForField = (fieldName: string): string | undefined => {
    return errors.find((e) => e.field === fieldName)?.message;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Task Manager</h1>

      {!token ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            {isLogin ? "Login" : "Register"}
          </h2>

          {errors.some((e) => !e.field) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
              {errors.find((e) => !e.field)?.message}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={authFormData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    getErrorForField("name") ? "border-red-500" : ""
                  }`}
                />
                {getErrorForField("name") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getErrorForField("name")}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={authFormData.email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  getErrorForField("email") ? "border-red-500" : ""
                }`}
              />
              {getErrorForField("email") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorForField("email")}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={authFormData.password}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    getErrorForField("password") ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {getErrorForField("password") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorForField("password")}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={authFormData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      getErrorForField("confirmPassword")
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {getErrorForField("confirmPassword") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getErrorForField("confirmPassword")}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                clearMessages();
              }}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Welcome, {user?.name || user?.email}
              </h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-medium mb-2">Add New Task</h3>
            <div className="flex">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task..."
                className="flex-1 p-2 border rounded-l"
              />
              <button
                onClick={addTask}
                className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>

          {selectedTask ? (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-medium mb-2">Edit Task</h3>
              <div className="flex">
                <input
                  type="text"
                  value={selectedTask.text}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, text: e.target.value })
                  }
                  className="flex-1 p-2 border rounded-l"
                />
                <button
                  onClick={() =>
                    updateTask(selectedTask._id, selectedTask.text)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-r hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          <div className="bg-white rounded shadow overflow-hidden">
            <h3 className="font-medium p-4 border-b">Your Tasks</h3>
            {tasks.length === 0 ? (
              <p className="p-4 text-gray-500">No tasks yet. Add one above!</p>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-4 border-b flex justify-between items-center"
                  >
                    <span>{task.text}</span>
                    <div>
                      <button
                        onClick={() => fetchTaskById(task._id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 p-4 bg-red-50 rounded">
            <h3 className="font-medium mb-2 text-red-800">Danger Zone</h3>
            <button
              onClick={deleteUserAccount}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete My Account
            </button>
            <p className="text-xs mt-2 text-red-600">
              Warning: This will permanently delete your account and all your
              tasks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
