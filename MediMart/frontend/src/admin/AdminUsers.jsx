import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./admin.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/sellers/${id}/status`, { status });
      showToast(`User status updated to ${status}`);
      fetchUsers();
    } catch (err) {
      showToast("Update failed");
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="admin-page">
        <h1>User Management</h1>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-info">
                      <strong>{u.name}</strong>
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${u.status || "approved"}`}>
                      {u.status || "Approved"}
                    </span>
                  </td>
                  <td>
                    {u.role === "seller" && (
                      <div className="admin-actions">
                        {u.status !== "approved" && (
                          <button className="approve-btn" onClick={() => updateStatus(u._id, "approved")}>
                            Approve
                          </button>
                        )}
                        {u.status !== "rejected" && (
                          <button className="reject-btn" onClick={() => updateStatus(u._id, "rejected")}>
                            Reject
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;