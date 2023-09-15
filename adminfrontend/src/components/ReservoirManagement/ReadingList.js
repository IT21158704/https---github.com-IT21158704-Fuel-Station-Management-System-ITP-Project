import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ReadingList() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch data
  function getUsers() {
    axios
      .get("http://localhost:8070/reservoirs/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
    setSearchInput("");
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Delete data
  function deletedata(i) {
    if (window.confirm('Do you want to delete "' + i.name + '" ?')) {
      axios
        .delete("http://localhost:8070/reservoirs/delete/" + i._id)
        .then(() => {
          getUsers();
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  // Search data
  function searchUser() {
    if (searchInput !== "") {
      axios
        .get(`http://localhost:8070/reservoirs/search/${searchInput}`)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      getUsers();
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUser();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
            <body>
              <div>
                    <section id="sidebar">
                    <br/><img className='brandLogo' src={require('./img/cpetcoLogo.png')} alt='logo'/><br/><br/>
                    <span className="brand">J.J. Dias Enterprises</span>
                    <ul className="side-menu top">
                        <li>
                            <a href={"/ReservoirDashboard"}>
                                <i className='bx bxs-dashboard' ></i>
                                <span className="text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/AddReservoir">
                                <i className='bx bx-user'></i>
                                <span className="text">Add Reading</span>
                            </a>
                        </li>
                        <li>
                            <a href="/ReadingList">
                                <i className='bx bxs-analyse'></i>
                                <span className="text">Reading List</span>
                            </a>
                        </li>
                        <li>
                            <a href="/ReadingListReport">
                            <i className='bx bx-cloud bx-flip-horizontal' ></i>
                                <span className="text">Generate Report</span>
                            </a>
                        </li>

                        <li>
                          <a href="/ReadingBackup">
                          <i className='bx bx-cloud bx-flip-horizontal' ></i>
                              <span className="text">Backup & Restore</span>
                          </a>
                            </li>
                            
                        <li>
                            <a className="logout" href="/login">
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
                                <h1>Reservoir Manager</h1>
                                <ul className="breadcrumb">
                                    <li>
                                        <a href="#">Home</a>
                                    </li>
                                    <li>
                                        <i className="bx bx-chevron-right"></i>
                                    </li>
                                    <li>
                                        <a className="active" href="#">
                                            Reservoir Management
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <Link to={"/AddReservoir"} className="btn-download">
                                <i className="bx bx-user-plus"></i>
                                <span className="text">Add Reading</span>
                            </Link>
                            </div>

                            <div className="table-data">
                                <div className="order">
                                    <div className="head">
                                        <h3>All Reading</h3>
                                        <div class="col-auto">
                                            <div class="input-group mb-2">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="inlineFormInputGroup"
                                                    placeholder="Search"
                                                    value={searchInput}
                                                    onChange={(e) => setSearchInput(e.target.value)}/>
                                                <div class="input-group-prepend" onClick={getUsers}>
                                                    <div class="input-group-text">
                                                        <i class="bx bx-x"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>

                                <table className="table-striped">
                                    <thead>
                                        <tr>
                                            <th>Pump Number</th>
                                            <th>Fuel Type</th>
                                            <th>Date</th>
                                            <th>Employee ID</th>
                                            <th>Morning Reading</th>
                                            <th>Litter Price</th>
                                            <th>Evening reading</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {users.map((i, index)=>{
                                                return(
                                                    <tr>
                                                         {/* <td>{index+1}</td>  */}
                                                        <td>{i.pump_number}</td>
                                                        <td>{i.fuel_type}</td>
                                                        <td>{i.date}</td>
                                                        <td>{i.employeeID}</td>
                                                        <td>{i.mReading}</td>
                                                        <td>{i.litterPrice}</td>
                                                        <td>{i.eReading}</td>
                                                        <td><Link to={`/EditReading/${i._id}`}><button type="button" className="btn btn-outline-success btn-sm" >Edit</button></Link></td>
                                                        <td><button type="button" className="btn btn-outline-danger btn-sm" onClick={(()=>deletedata(i))}>Remove</button></td>
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </section>
            </body>
    )
}

export default ReadingList