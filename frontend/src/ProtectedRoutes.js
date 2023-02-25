import React from 'react'
import { Route, Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'
const cookies = new Cookies()

const wrapper: CSSProperties = {
  position: "fixed", 
  top: "50%", 
  left: "50%", 
  transform: "translate(-50%, -50%)",
}

const container: CSSProperties = {
  height: '100vh',
  width: '100vw',
  backgroundColor: "RGBA(0,0,0,0.5)",
  position: "fixed",
  zIndex: '9999',
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '2rem',
  },
};

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ component: Component, ...rest }) {
  const token = cookies.get("TOKEN")
  const navigate = useNavigate()
  const [color, setColor] = React.useState('#ffffff')
  const logout = (e) => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  const [isLoading, setIsLoading] = React.useState(false)

  const showLoading = (isLoadingChild) => {
    if (isLoadingChild) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }

  document.title = "Koneksub | Dashboard"
  if(token){
    return(
    <>
      {isLoading ? (
      <div style={container}>
        <div style={wrapper}>
          <ClipLoader color={color} loading={isLoading} size={200}/>
        </div>
      </div>) : (
        <div />
      )}
      <div id="wrapper">
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" style={{height: '100%', width: '160px', position: 'fixed', 'zIndex': '1', top: '0', left: '0','overflowX': 'hidden', 'paddingTop': '20px'}}>
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">Admin Dashboard <sup></sup></div>
                </a>
                <hr className="sidebar-divider my-0" />
                <li className="nav-item active">
                    <a className="nav-link" href="/">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></a>
                </li>
                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Interface
                </div>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="/article">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Article</span>
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="/reward">
                        <i className="fas fa-plus"></i>
                        <span>Reward</span>
                    </a>

                    <form className="add_artikel" action="#" id="myform">
                        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Add Article</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">Judul:</label>
                                            <input type="text" className="form-control" id="recipient-name" name="judul_artikel123" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message-text" className="col-form-label">Keterangan</label>
                                            <textarea className="form-control" id="message-text" name="keterangan_artikel123"></textarea>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <input type="submit" id="firebase_inputa" name="addArtikel" value="Add Artikel" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Components:</h6>
                            <a className="collapse-item" href="buttons.html">Buttons</a>
                            <a className="collapse-item" href="cards.html">Cards</a>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="/partner" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">

                        <i className="fas fa-fw fa-wrench"></i>
                        <span>Mitra</span>
                    </a>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Utilities:</h6>
                            <a className="collapse-item" href="utilities-color.html">Colors</a>
                            <a className="collapse-item" href="utilities-border.html">Borders</a>
                            <a className="collapse-item" href="utilities-animation.html">Animations</a>
                            <a className="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="/user" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">

                        <i className="fas fa-fw fa-wrench"></i>
                        <span>User</span>
                    </a>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Utilities:</h6>
                            <a className="collapse-item" href="utilities-color.html">Colors</a>
                            <a className="collapse-item" href="utilities-border.html">Borders</a>
                            <a className="collapse-item" href="utilities-animation.html">Animations</a>
                            <a className="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="/trash_deposit" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">
                      <i className="fas fa-fw fa-wrench"></i>
                      <span>Trash Deposit</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" onClick={() => logout() }>
                        <i className="fa fa-power-off"></i>
                        <span>Logout</span>
                    </a>
                </li>

                <li className="nav-item">
                    <form className="add_artikel" action="#" id="myform">
                        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Add Article</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">Judul:</label>
                                            <input type="text" className="form-control" id="recipient-name" name="judul_artikel123" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message-text" className="col-form-label">Keterangan</label>
                                            <textarea className="form-control" id="message-text" name="keterangan_artikel123"></textarea>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <input type="submit" id="firebase_inputa" name="addArtikel" value="Add Artikel" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </li>

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle">  </button>
                </div>
            </ul>
            <div id="content-wrapper" className="d-flex flex-column p-3" style={{'marginLeft': '14rem'}}>
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                            <i className="fa fa-bars"></i>
                        </button>
                        <form
                            className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                                    aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown no-arrow d-sm-none">
                                <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-search fa-fw"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                    aria-labelledby="searchDropdown">
                                    <form className="form-inline mr-auto w-100 navbar-search">
                                        <div className="input-group">
                                            <input type="text" className="form-control bg-light border-0 small"
                                                placeholder="Search for..." aria-label="Search"
                                                aria-describedby="basic-addon2" />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button">
                                                    <i className="fas fa-search fa-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </li>

                            <li className="nav-item dropdown no-arrow mx-1">
                                <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-bell fa-fw"></i>
                                    <span className="badge badge-danger badge-counter">3+</span>
                                </a>
                                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                    aria-labelledby="alertsDropdown">
                                    <h6 className="dropdown-header">
                                        Alerts Center
                                    </h6>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="mr-3">
                                            <div className="icon-circle bg-primary">
                                                <i className="fas fa-file-alt text-white"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="small text-gray-500">December 12, 2019</div>
                                            <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                        </div>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="mr-3">
                                            <div className="icon-circle bg-success">
                                                <i className="fas fa-donate text-white"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="small text-gray-500">December 7, 2019</div>
                                            $290.29 has been deposited into your account!
                                        </div>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="mr-3">
                                            <div className="icon-circle bg-warning">
                                                <i className="fas fa-exclamation-triangle text-white"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="small text-gray-500">December 2, 2019</div>
                                            Spending Alert: We've noticed unusually high spending for your account.
                                        </div>
                                    </a>
                                    <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                                </div>
                            </li>

                            <li className="nav-item dropdown no-arrow mx-1">
                                <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-envelope fa-fw"></i>
                                    <span className="badge badge-danger badge-counter">7</span>
                                </a>
                                <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                    aria-labelledby="messagesDropdown">
                                    <h6 className="dropdown-header">
                                        Message Center
                                    </h6>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="dropdown-list-image mr-3">
                                            <img className="rounded-circle" src="img/undraw_profile_1.svg"
                                                alt="..." />
                                            <div className="status-indicator bg-success"></div>
                                        </div>
                                        <div className="font-weight-bold">
                                            <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                                problem I've been having.</div>
                                            <div className="small text-gray-500">Emily Fowler · 58m</div>
                                        </div>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="dropdown-list-image mr-3">
                                            <img className="rounded-circle" src="img/undraw_profile_2.svg"
                                                alt="..." />
                                            <div className="status-indicator"></div>
                                        </div>
                                        <div>
                                            <div className="text-truncate">I have the photos that you ordered last month, how
                                                would you like them sent to you?</div>
                                            <div className="small text-gray-500">Jae Chun · 1d</div>
                                        </div>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="dropdown-list-image mr-3">
                                            <img className="rounded-circle" src="img/undraw_profile_3.svg"
                                                alt="..." />
                                            <div className="status-indicator bg-warning"></div>
                                        </div>
                                        <div>
                                            <div className="text-truncate">Last month's report looks great, I am very happy with
                                                the progress so far, keep up the good work!</div>
                                            <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                                        </div>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <div className="dropdown-list-image mr-3">
                                            <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                                alt="..." />
                                            <div className="status-indicator bg-success"></div>
                                        </div>
                                        <div>
                                            <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                                                told me that people say this to all dogs, even if they aren't good...</div>
                                            <div className="small text-gray-500">Chicken the Dog · 2w</div>
                                        </div>
                                    </a>
                                    <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                                </div>
                            </li>

                            <div className="topbar-divider d-none d-sm-block"></div>

                            <li className="nav-item dropdown no-arrow">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">Username</span>
                                    <img className="img-profile rounded-circle"
                                        src="img/undraw_profile.svg" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                    aria-labelledby="userDropdown">
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Profile
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Settings
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Activity Log
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className="container-fluid">
                        <Component {...rest } showLoading={showLoading} />
                    </div>
                </div>
            </div>
        </div>
        <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                        <a className="btn btn-primary" href="login.html">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
        <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
        <script src="js/sb-admin-2.min.js"></script>
        <script src="vendor/chart.js/Chart.min.js"></script>
        <script src="js/demo/chart-area-demo.js"></script>
        <script src="js/demo/chart-pie-demo.js"></script>
        <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
        <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
        </>
    )
  }else{
    return (
      <Navigate
        to={{
          pathname: "/login",
          state: {
            // sets the location a user was about to access before being redirected to login
            from: rest.location,
          },
        }}
      />
    )
  }
//  return (
//
//    // this route takes other routes assigned to it from the App.js and return the same route if condition is met
//    <Route
//      {...rest}
//      render={(props) => {
//
//        // returns route if there is a valid token set in the cookie
//        if (token) {
//          return <Component {...props} />;
//        } else {
//          // returns the user to the landing page if there is no valid token set
//          return (
//            <Navigate
//              to={{
//                pathname: "/",
//                state: {
//                  // sets the location a user was about to access before being redirected to login
//                  from: props.location,
//                },
//              }}
//            />
//          );
//        }
//      }}
//    />
//  );
}
