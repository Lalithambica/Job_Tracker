import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/layout";
import API from "../services/api";
import { SearchContext } from "../context/SearchContext";


function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const { searchQuery } = useContext(SearchContext);



  const [showModal, setShowModal] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [jobLink, setJobLink] = useState("");

  useEffect(() => {
    document.title = "Dashboard | Job Tracker";
  }, []);
  
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchApplications();
      fetchInterviews();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications");
      setApplications(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchInterviews = async () => {
    try {
      const { data } = await API.get("/interviews");
      setInterviews(data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleAddApplication = async (e) => {
      e.preventDefault();
  
      try {
        const formData = new FormData();
        formData.append("companyName", companyName);
        formData.append("role", role);
        formData.append("appliedDate", appliedDate);
        formData.append("jobLink", jobLink);
        formData.append("resume", resume);
  
        await API.post("/applications", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setCompanyName("");
        setRole("");
        setResume(null);
        setAppliedDate("");
        setJobLink("");
        setShowModal(false);
        fetchApplications();
      } catch (error) {
        console.log(error);
      }
    };

  const total = applications.length;
  const applied = applications.filter(a => a.status === "Applied").length;
  const interview = applications.filter(a => a.status === "Interview").length;
  const offer = applications.filter(a => a.status === "Offer").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  const upcomingInterviews = interviews
    .filter((int) => int.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((int) => new Date(int.time) > new Date())
    .sort((a, b) => new Date(a.time) - new Date(b.time))
  const topThree = upcomingInterviews.slice(0,3);


  const cardStyle = {
    background: "#f4f4f4",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "120px",
    textAlign: "center"
  };

  return (
    <Layout>
      <h1 className="text-5xl font-bold text-blue-600">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>

      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500">Total</h4>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow">
          <h4 className="text-blue-600">Applied</h4>
          <p className="text-2xl font-bold">{applied}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h4 className="text-yellow-600">Interview</h4>
          <p className="text-2xl font-bold">{interview}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h4 className="text-green-600">Offer</h4>
          <p className="text-2xl font-bold">{offer}</p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <h4 className="text-red-600">Rejected</h4>
          <p className="text-2xl font-bold">{rejected}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-10">
        <h2 className="text-xl font-semibold">
          Upcoming Interviews
        </h2>

        <span className={`text-sm px-3 py-1 rounded-full ${
          upcomingInterviews.length === 0
            ? "bg-gray-300 text-gray-700"
            : "bg-blue-500 text-white"
        }`}>
          {upcomingInterviews.length}
        </span>
      </div>




      <div className="grid grid-cols-3 gap-4 mt-4">
        {upcomingInterviews.length === 0 ? (
          <p className="text-gray-500">No upcoming interviews.</p>
        ) : (
          topThree.map((int) => (
            <div
              key={int._id}
              className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
            >
              <h3 className="font-semibold">{int.companyName}</h3>
              <p className="text-gray-600">{int.role}</p>
              <p className="text-sm text-gray-500 mt-2">
                {int.round} Round
              </p>
              <p className="text-sm font-medium mt-1">
                {new Date(int.time).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
      {upcomingInterviews.length > 3 && (
        <div className="mt-4">
          <button
          onClick={() => navigate("/interviews")}
          className="text-blue-600 hover:underline font-medium"
          >
            Show More
          </button>
        </div>
      )}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        + Add Application
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white p-6 rounded-lg shadow-lg w-96">

            <h3 className="text-lg font-semibold mb-4">
              Add Application
            </h3>

            <form onSubmit={handleAddApplication}>

              <input
                placeholder="Company Name"
                className="w-full border px-3 py-2 mb-3"
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                required
              />

              <input
                placeholder="Role"
                className="w-full border px-3 py-2 mb-3"
                value={role}
                onChange={(e)=>setRole(e.target.value)}
                required
              />

              <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                  <br /><br />

              <input
                type="date"
                className="w-full border px-3 py-2 mb-3"
                value={appliedDate}
                onChange={(e)=>setAppliedDate(e.target.value)}
              />

              <input
                placeholder="Job Link"
                className="w-full border px-3 py-2 mb-4"
                value={jobLink}
                onChange={(e)=>setJobLink(e.target.value)}
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={()=>setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </Layout>
  );
}

export default Dashboard;
