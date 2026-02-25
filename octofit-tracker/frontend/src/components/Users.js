import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', teamId: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const usersUrl = `${baseUrl}/api/users/`;
  const teamsUrl = `${baseUrl}/api/teams/`;

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log('Users: fetching from', usersUrl);
    console.log('Teams: fetching from', teamsUrl);

    Promise.all([
      fetch(usersUrl).then(r => { if (!r.ok) throw new Error(`Users HTTP ${r.status}`); return r.json(); }),
      fetch(teamsUrl).then(r => { if (!r.ok) throw new Error(`Teams HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([userData, teamData]) => {
        console.log('Users: fetched data', userData);
        console.log('Teams: fetched data', teamData);
        setUsers(Array.isArray(userData) ? userData : userData.results || []);
        setTeams(Array.isArray(teamData) ? teamData : teamData.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [usersUrl, teamsUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Find which team a username currently belongs to
  const getUserTeamId = (username) => {
    const team = teams.find(t => Array.isArray(t.members) && t.members.includes(username));
    return team ? team._id : '';
  };

  const openEdit = (user) => {
    setSaveError(null);
    setSaveSuccess(false);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      teamId: getUserTeamId(user.username),
    });
    setEditingUser(user);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const oldUsername = editingUser.username;
    const newUsername = formData.username.trim();
    const oldTeamId = getUserTeamId(oldUsername);
    const newTeamId = formData.teamId;

    try {
      // 1. PATCH user fields
      const userPayload = { username: newUsername, email: formData.email.trim() };
      if (formData.password.trim()) userPayload.password = formData.password.trim();

      console.log(`Users: PATCH ${usersUrl}${editingUser._id}/`, userPayload);
      const userRes = await fetch(`${usersUrl}${editingUser._id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!userRes.ok) {
        const body = await userRes.text();
        throw new Error(`Failed to update user (${userRes.status}): ${body}`);
      }

      // 2. Update team memberships
      // Case A: team changed  → remove from old team, add to new team
      // Case B: same team but username changed → update member entry in same team
      if (oldTeamId !== newTeamId || oldUsername !== newUsername) {
        // Remove old username from old team (if any)
        if (oldTeamId) {
          const oldTeam = teams.find(t => t._id === oldTeamId);
          if (oldTeam) {
            const updatedMembers = (oldTeam.members || []).filter(m => m !== oldUsername);
            // If same team and username changed, add new username back
            if (oldTeamId === newTeamId && newUsername) {
              updatedMembers.push(newUsername);
            }
            console.log(`Teams: PATCH ${teamsUrl}${oldTeam._id}/ members:`, updatedMembers);
            const teamRes = await fetch(`${teamsUrl}${oldTeam._id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ members: updatedMembers }),
            });
            if (!teamRes.ok) throw new Error(`Failed to update old team (${teamRes.status})`);
          }
        }

        // Add new username to new team (only when team actually changed)
        if (newTeamId && newTeamId !== oldTeamId) {
          const newTeam = teams.find(t => t._id === newTeamId);
          if (newTeam) {
            const updatedMembers = [...(newTeam.members || []).filter(m => m !== newUsername), newUsername];
            console.log(`Teams: PATCH ${teamsUrl}${newTeam._id}/ members:`, updatedMembers);
            const teamRes = await fetch(`${teamsUrl}${newTeam._id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ members: updatedMembers }),
            });
            if (!teamRes.ok) throw new Error(`Failed to update new team (${teamRes.status})`);
          }
        }
      }

      setSaveSuccess(true);
      setSaving(false);
      fetchData(); // refresh table
      setTimeout(closeEdit, 1000);
    } catch (err) {
      console.error('Users: save error', err);
      setSaveError(err.message);
      setSaving(false);
    }
  };

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = editingUser ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [editingUser]);

  const currentTeamName = (username) => {
    const team = teams.find(t => Array.isArray(t.members) && t.members.includes(username));
    return team ? team.name : <span className="text-muted fst-italic">None</span>;
  };

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
          <span>&#128100; Users</span>
          {!loading && !error && (
            <span className="badge bg-light text-primary">{users.length} total</span>
          )}
        </div>
        <div className="card-body p-0">
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3 text-muted">Loading users...</span>
            </div>
          )}
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Team</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="octofit-empty">No users found.</div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id || index}>
                        <td>{index + 1}</td>
                        <td><strong>{user.username}</strong></td>
                        <td>
                          <a href={`mailto:${user.email}`} className="text-decoration-none">
                            {user.email}
                          </a>
                        </td>
                        <td>{currentTeamName(user.username)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(user)}
                          >
                            &#9998; Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit User Modal ── */}
      {editingUser && (
        <>
          <div
            className="modal fade show"
            style={{ display: 'block' }}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="editUserModalLabel"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title" id="editUserModalLabel">
                    &#9998; Edit User — <em>{editingUser.username}</em>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeEdit}
                    aria-label="Close"
                    disabled={saving}
                  />
                </div>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger py-2" role="alert">
                      <strong>Error:</strong> {saveError}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="alert alert-success py-2" role="alert">
                      &#10003; User updated successfully!
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="edit-username" className="form-label fw-semibold">
                      Username
                    </label>
                    <input
                      id="edit-username"
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-password" className="form-label fw-semibold">
                      New Password{' '}
                      <span className="text-muted fw-normal">(leave blank to keep current)</span>
                    </label>
                    <input
                      id="edit-password"
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="mb-1">
                    <label htmlFor="edit-team" className="form-label fw-semibold">
                      Team
                    </label>
                    <select
                      id="edit-team"
                      className="form-select"
                      name="teamId"
                      value={formData.teamId}
                      onChange={handleChange}
                      disabled={saving}
                    >
                      <option value="">— No team —</option>
                      {teams.map(team => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || !formData.username.trim() || !formData.email.trim()}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Saving…
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop */}
          <div className="modal-backdrop fade show" onClick={!saving ? closeEdit : undefined} />
        </>
      )}
    </div>
  );
}

export default Users;


