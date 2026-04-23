import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SearchContext } from "../context/SearchContext";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);

  const [applicationId, setApplicationId] = useState("");
  const [editApplicationId, setEditApplicationId] = useState("");

  const [showModal, setShowModal] = useState(false);

  // SAFE SEARCH CONTEXT
  const searchContext = useContext(SearchContext);
  const searchQuery = searchContext?.searchQuery || "";

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editRound, setEditRound] = useState("");
  const [editTime, setEditTime] = useState("");

  const [round, setRound] = useState("");
  const [time, setTime] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Interview | Job Tracker";
}, []);


  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchInterviews();
      fetchApplications();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get("/interviews");
      setInterviews(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications");
      setApplications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddInterview = async (e) => {
    e.preventDefault();

    const selectedApp = applications.find(
      (app) => app._id === applicationId
    );

    if (!selectedApp) {
      alert("Please select an application");
      return;
    }

    try {
      await API.post("/interviews", {
        application: applicationId,
        companyName: selectedApp.companyName,
        role: selectedApp.role,
        round,
        time
      });

      setShowModal(false);
      setApplicationId("");
      setRound("");
      setTime("");
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteInterview = async (id) => {
    try {
      await API.delete(`/interviews/${id}`);
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (interview) => {
    setEditId(interview._id);
    setEditApplicationId(interview.application || "");
    setEditRound(interview.round);
    const formattedTime = interview.time
      ? new Date(interview.time).toISOString().slice(0, 16)
      : "";

    setEditTime(formattedTime);
    setEditModalOpen(true);
  };

  const handleUpdateInterview = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/interviews/${editId}`, {
        application: editApplicationId,
        round: editRound,
        time: editTime
      });

      setEditModalOpen(false);
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Interviews</h2>

      <div className="flex gap-8">

        {/* LEFT SIDE */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">
            All Interviews
          </h3>

          {interviews.length === 0 ? (
            <p className="text-gray-500">No interviews scheduled.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Round</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {interviews
                  .filter((int) =>
                    int.companyName
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .sort((a, b) => new Date(a.time) - new Date(b.time))
                  .map((int) => (
                    <tr key={int._id} className="border-b hover:bg-gray-50">
                      <td>{new Date(int.time).toLocaleDateString()}</td>
                      <td>{int.companyName}</td>
                      <td>{int.role}</td>
                      <td>{int.round}</td>
                      <td>{new Date(int.time).toLocaleTimeString()}</td>
                      <td className="space-x-3">
                        <button
                          onClick={() => handleEditClick(int)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInterview(int._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-80">
          {/* <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600"
          >
            Schedule Interview
          </button> */}
          <button
            onClick={() => {
              console.log("CLICKED");
              setShowModal(true);
            }}
            className="w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600"
          >
            Schedule Interview
          </button>

          <div className="bg-white p-4 rounded shadow">
            <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              if (view !== "month") return;

              const interviewOnDate = interviews.find((int) => {
                const interviewDate = new Date(int.time);
                return interviewDate.toDateString() === date.toDateString();
              });

              if (!interviewOnDate) return;

              const today = new Date();
              const interviewDate = new Date(interviewOnDate.time);

              const diffTime = interviewDate - today;
              const diffDays = diffTime / (1000 * 60 * 60 * 24);

              if (diffDays < 0) {
                return "pastInterview";       // red
              }

              if (diffDays <= 3) {
                return "urgentInterview";     // yellow
              }

              return "upcomingInterview";     // green
            }}
          />
          </div>
        </div>
      </div>
      {/* ADD MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              minWidth: "300px"
            }}
          >
            <h3>Schedule Interview</h3>

            <form onSubmit={handleAddInterview}>

              <select
                className="w-full border px-3 py-2 mb-3"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                required
              >
                <option value="">Select Application</option>
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.companyName} - {app.role}
                  </option>
                ))}
              </select>

              <input
                placeholder="Interview Round (HR / Technical / Manager)"
                className="w-full border px-3 py-2 mb-3"
                value={round}
                onChange={(e) => setRound(e.target.value)}
              />

              <input
                type="datetime-local"
                className="w-full border px-3 py-2 mb-4"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>

              </div>

            </form>
          </div>
        </div>
      )}


      {/* EDIT MODAL */}
      {editModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              minWidth: "300px"
            }}
          >
            <h3>Edit Interview</h3>

            <form onSubmit={handleUpdateInterview}>
              <select
                value={editApplicationId}
                onChange={(e) => setEditApplicationId(e.target.value)}
              >
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.companyName} - {app.role}
                  </option>
                ))}
              </select>

              <br /><br />

              <input
                placeholder="Round"
                value={editRound}
                onChange={(e) => setEditRound(e.target.value)}
              />

              <br /><br />

              <input
                type="datetime-local"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />

              <br /><br />

              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Interviews;