import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header bg-success text-white d-flex align-items-center justify-content-between">
          <span>&#128101; Teams</span>
          {!loading && !error && (
            <span className="badge bg-light text-success">{teams.length} total</span>
          )}
        </div>
        <div className="card-body p-0">
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3 text-muted">Loading teams...</span>
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
                <thead className="table-success">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        <div className="octofit-empty">No teams found.</div>
                      </td>
                    </tr>
                  ) : (
                    teams.map((team, index) => (
                      <tr key={team._id || index}>
                        <td>{index + 1}</td>
                        <td><strong>{team.name}</strong></td>
                        <td>
                          {Array.isArray(team.members)
                            ? team.members.map((m, i) => (
                                <span key={i} className="badge bg-secondary me-1">{m}</span>
                              ))
                            : <span className="badge bg-secondary">{team.members}</span>
                          }
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
    </div>
  );
}

export default Teams;

