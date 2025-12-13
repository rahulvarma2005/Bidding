import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const TeamsSummary = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/teams`);
        if (!res.ok) {
          throw new Error('Failed to load teams');
        }
        const data = await res.json();
        setTeams(data || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading teams summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Teams & Purchased Players
        </h1>

        {teams.length === 0 && (
          <p className="text-gray-600">No teams found.</p>
        )}

        <div className="space-y-6">
          {teams.map((team) => {
            const soldPlayers = (team.squad || []).filter(
              (p) => p.status === 'SOLD'
            );

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      {team.logoUrl && (
                        <img
                          src={team.logoUrl}
                          alt={team.teamName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      )}
                      <span>{team.teamName}</span>
                      {team.acronym && (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {team.acronym}
                        </span>
                      )}
                    </h2>
                      {/* Owner name intentionally hidden for all teams */}
                  </div>

                  <div className="text-sm text-gray-700">
                    <p>
                      Total Purse:{' '}
                      <span className="font-semibold">
                        ₹{team.totalPurse?.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <p>
                      Remaining:{' '}
                      <span className="font-semibold text-green-700">
                        ₹{team.remainingPurse?.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Players Bought ({soldPlayers.length})
                  </h3>

                  {soldPlayers.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      No players bought yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600">
                              Player
                            </th>
                            <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600">
                              Role
                            </th>
                            <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600">
                              Final Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {soldPlayers.map((p) => (
                            <tr
                              key={p.id}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-2 px-2 sm:px-3 text-gray-800">
                                {p.name}
                              </td>
                              <td className="py-2 px-2 sm:px-3 text-gray-600">
                                {p.role}
                              </td>
                              <td className="py-2 px-2 sm:px-3 font-semibold text-gray-900">
                                ₹{p.soldPrice?.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamsSummary;
