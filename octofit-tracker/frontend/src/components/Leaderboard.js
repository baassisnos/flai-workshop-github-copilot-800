import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const rankStyle = (index) => {
    if (index === 0) return 'bg-warning text-dark';
    if (index === 1) return 'bg-secondary text-white';
    if (index === 2) return 'bg-danger text-white';
    return 'bg-primary text-white';
  };

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header bg-danger text-white d-flex align-items-center justify-content-between">
          <span>&#127942; Leaderboard</span>
          {!loading && !error && (
            <span className="badge bg-light text-danger">{entries.length} entries</span>
          )}
        </div>
        <div className="card-body p-0">
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3 text-muted">Loading leaderboard...</span>
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
                <thead className="table-danger">
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">User</th>
                    <th scope="col">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        <div className="octofit-empty">No leaderboard entries found.</div>
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, index) => (
                      <tr key={entry._id || index}>
                        <td>
                          <span className={`rank-badge ${rankStyle(index)}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td><strong>{entry.user}</strong></td>
                        <td>
                          <span className="badge bg-danger fs-6">{entry.score}</span>
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

export default Leaderboard;

