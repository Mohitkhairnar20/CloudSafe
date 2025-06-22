import { useState } from 'react';
import { useAuth } from "react-oidc-context";
import { getFileFromS3, putFileToS3 } from "./utils/utils";

function App() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("password");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadError, setDownloadError] = useState(""); // For download error popup

  const { user, isAuthenticated, isLoading, error, signinRedirect, removeUser } = useAuth();
  const userEmail = user?.id_token && JSON.parse(atob(user?.id_token?.split(".")[1]))?.email

  const signOutRedirect = () => {
    removeUser()
    const clientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = import.meta.env.VITE_COGNITO_USER_POOL_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload");
      return;
    }
    setUploading(true);
    const fileExt = file?.name?.split(".").slice(-1)[0];
    const fileName = btoa(userEmail) + secret + "." + fileExt;
    try {
      await putFileToS3(file, fileName, user?.id_token)
      setMessage(`File uploaded successfully! Secret to share is ${secret}-${fileExt}`);
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Modified download handler to handle errors and show popup
  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      await getFileFromS3(`${btoa(email)}${secret?.split("-")[0]}.${secret?.split("-")[1]}`);
    } catch (err) {
      setDownloadError(err?.message || "Failed to download file.");
    }
  };

  const closeDownloadError = () => setDownloadError("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-xl font-semibold text-blue-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-xl font-semibold text-red-700">
          Encountering error... {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">
      {/* Error popup */}
      {downloadError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-red-300 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M12 9v2m0 4h.01M12 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-lg font-semibold text-red-700">Download Error</span>
            </div>
            <div className="text-red-600 mb-4">{downloadError}</div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg font-medium"
              onClick={closeDownloadError}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full shadow-lg bg-white/80 backdrop-blur-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-blue-800 tracking-wide drop-shadow-sm">S3 File Share</h1>
        {!isAuthenticated ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            onClick={() => signinRedirect()}
          >
            Sign In
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            onClick={signOutRedirect}
          >
            Sign Out
          </button>
        )}
      </header>
      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Download */}
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 16V4m0 12l-4-4m4 4l4-4m-9 8h14a2 2 0 002-2v-4a2 2 0 00-2-2h-1"/></svg>
            Download File
          </h2>
          <form className="flex flex-col gap-3" onSubmit={handleDownload}>
            {/* Email */}
            <div className="relative">
              <input
                type="text"
                id="download-email"
                className="peer border border-blue-300 rounded-lg p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
              <label
                htmlFor="download-email"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white px-1 transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:-top-3 peer-valid:text-xs pointer-events-none"
                style={{
                  top: email ? "-0.75rem" : "50%",
                  fontSize: email ? "0.75rem" : "1rem",
                  color: email ? "#2563eb" : "#3b82f6",
                }}
              >
                File owner's email
              </label>
            </div>
            {/* Secret */}
            <div className="relative">
              <input
                type="text"
                id="download-secret"
                className="peer border border-blue-300 rounded-lg p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                autoComplete="off"
                required
              />
              <label
                htmlFor="download-secret"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 bg-white px-1 transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:-top-3 peer-valid:text-xs pointer-events-none"
                style={{
                  top: secret ? "-0.75rem" : "50%",
                  fontSize: secret ? "0.75rem" : "1rem",
                  color: secret ? "#2563eb" : "#3b82f6",
                }}
              >
                Secret key
              </label>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
              type="submit"
            >
              Download
            </button>
          </form>
        </div>
        {/* Upload */}
        {isAuthenticated && (
          <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 8v8m0 0l-4-4m4 4l4-4m-9 8h14a2 2 0 002-2v-4a2 2 0 00-2-2h-1"/></svg>
              Upload File
            </h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 w-full"
                  value={userEmail}
                  disabled={true}
                  id="upload-email"
                />
                <label
                  htmlFor="upload-email"
                  className="absolute left-3 -top-3 text-xs text-gray-500 bg-white px-1 pointer-events-none"
                >
                  Your email
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="upload-secret"
                  className="peer border border-green-300 rounded-lg p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-200"
                  value={secret}
                  onChange={e => setSecret(e.target.value)}
                  autoComplete="off"
                  required
                />
                <label
                  htmlFor="upload-secret"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 bg-white px-1 transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-700 peer-valid:-top-3 peer-valid:text-xs pointer-events-none"
                  style={{
                    top: secret ? "-0.75rem" : "50%",
                    fontSize: secret ? "0.75rem" : "1rem",
                    color: secret ? "#15803d" : "#22c55e",
                  }}
                >
                  Secret key
                </label>
              </div>
              <input
                type="file"
                accept=".txt"
                className="file:rounded-lg file:border-0 file:bg-green-500 file:text-white file:font-semibold file:px-4 file:py-2 file:mr-4 hover:file:bg-green-600"
                onChange={handleFileChange}
              />
              <button
                className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {message && (
                <div className="mt-2 text-center font-medium text-green-700 bg-green-50 border border-green-200 rounded-md py-2 px-3">
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm bg-white/80 backdrop-blur-md shadow-inner">
        &copy; {new Date().getFullYear()} S3 File Share. All rights reserved.
      </footer>
    </div>
  );
}

export default App;