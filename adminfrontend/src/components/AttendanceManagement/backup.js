import React, {useState, useEffect}  from "react";
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';

function ABackup() {
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();
  // Fetch data
  useEffect(()=>{
    function fetchData() {
        axios.get("http://localhost:8070/attendance/")
        .then((res) => {
            setAttendance(res.data);
        })
        .catch((err) => {
            alert(err.message);
        })
    }
    fetchData();
  },[])

  function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  

  // Backup data
  function backup() {
    if (window.confirm(attendance.length+' Attendnace in database. Do you need to backup?')) {
    axios.get("http://localhost:8070/attendance/")
      .then((res) => {
        const data = res.data;
        const json = JSON.stringify(data);
        download("attendance.json", json);
      })
      .catch((err) => {
        alert(err.message);
      })
  }}

  // Restore data
  function restore(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(file);
  }

  function handleFileLoad(event) {
    try {
      const json = event.target.result;
      const data = JSON.parse(json);
      // Upload the data to the database
      data.forEach((attendance) => {
        axios.post("http://localhost:8070/attendance/add", attendance).then(() => {
            console.log("Attendance created: ", attendance);
        }).catch((err) => {
          console.error("Error creating attendance: ", err);
        });
      });
    } catch (err) {
      console.error("Error parsing JSON file: ", err);
    }
    alert("Restore Successfull !");
    navigate('/ManageAttendance');
  }

  return (
    <body>
      <div>
            <section id="sidebar">
                    <br/><img className='brandLogo' src={require('./img/cpetcoLogo.png')} alt='logo'/><br/><br/>
                    <span className="brand">J.J. Dias Enterprises</span>
                    <ul className="side-menu top">
                        <li>
                            <a href={"/AttendanceDashboard"}>
                                <i className='bx bxs-dashboard' ></i>
                                <span className="text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/ManageAttendance">
                                <i className='bx bx-user'></i>
                                <span className="text">Attendance Management</span>
                            </a>
                        </li>
                        <li>
                            <a href="/ManageShift">
                                <i className='bx bxs-analyse'></i>
                                <span className="text">Shift Management</span>
                            </a>
                        </li>
                        <li>
                            <a href="/GenerateReport">
                                <i className='bx bxs-analyse'></i>
                                <span className="text">Generate Report</span>
                            </a>
                        </li>
                        <li>
                            <a href="/ABackup">
                            <i className='bx bx-cloud bx-flip-horizontal' ></i>
                                <span className="text">Backup & Restore</span>
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="logout">
                                <i className='bx bx-exit'></i>
                                <span className="text">Logout</span>
                            </a>
                        </li>
                    </ul>
            </section>
        </div>
        <section id="content">
            <main>

            <div className="head-title">
                <div className="left">
                    <h1>Backup and Restore</h1>
                    <ul className="breadcrumb">
                    <li>
                         <a href="#" className='active'>Backup and Restore</a>
                    </li>
                    </ul>
                    </div>
                </div>

                <div className="table-data">
                    <div className="order">
                        <div className="head">
                            <h3>Backup data</h3>
                        </div>
                        <button onClick={backup} className="btn btn-info">Backup data</button>
                            <p className="blockquote-footer">Total Attendance: <Link to={'/ManageAttendance'}>{attendance.length}</Link></p>
                    </div>
                    <div className="order">
                        <div className="head">
                            <h3>Restore data</h3>
                        </div>
                        <input type="file" onChange={restore}  className="btn btn-secondary"/>
                    </div>
                </div>
            </main>
        </section>
    </body>
  );
}

export default ABackup;