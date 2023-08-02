import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Button, Badge, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Header, SidebarNav, Footer, PageContent, Avatar, Chat, PageAlert, Page } from '../bg';
import Logo from '../assets/images/bg-logo.svg';
import nav from '../_nav';
import routes from '../views';
import ContextProviders from '../bg/components/utilities/ContextProviders';
import handleKeyAccessibility, { handleClickAccessibility } from '../bg/helpers/handleTabAccessibility';
import '../bg/scss/styles.scss';
import Dashboard from '../views/pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderNav from './HeaderNav';
import metadata from '../metadata.json';
import IdleTimer from 'react-idle-timer';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const MOBILE_SIZE = 992;

export default class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    let loggedIn = true;
    // const token = localStorage.getItem("token");
    const token = cookies.get('token');
    if (!token) loggedIn = false;

    this.state = {
      sidebarCollapsed: false,
      isMobile: window.innerWidth <= MOBILE_SIZE,
      loggedIn
    };
    this.handleOnIdle = this.handleOnIdle.bind(this)
  }

  handleResize = () => {
    if (window.innerWidth <= MOBILE_SIZE) {
      this.setState({ sidebarCollapsed: false, isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  };

  componentDidUpdate(prev) {
    if (this.state.isMobile && prev.location.pathname !== this.props.location.pathname) {
      this.toggleSideCollapse();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', handleKeyAccessibility);
    document.addEventListener('click', handleClickAccessibility);

    // window.addEventListener("beforeunload", (e) => {
    //   e.preventDefault();
    //   cookies.remove("token");
    //   cookies.remove("expireTime");
    //   cookies.remove("userInfo");
    // });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  toggleSideCollapse = () => {
    this.setState(prevState => ({ sidebarCollapsed: !prevState.sidebarCollapsed }));
  };
  getNavByRole = () => {
    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userInfo = cookies.get("userInfo");
    if (userInfo)
      nav.top = nav.top.filter(x => !x.role || x.role.includes(userInfo.role));
    return nav;
  }

  handleOnIdle(event) {
    return this.props.history.push('/logout');
  }
  render() {
    const { sidebarCollapsed, loggedIn } = this.state;
    const sidebarCollapsedClass = sidebarCollapsed ? 'side-menu-collapsed' : '';
    const fullVersion = `v${metadata.version}.${metadata.release}.${metadata.build}`;

    if (!loggedIn) {
      return <Redirect to="/login" />
    }

    return (
      <ContextProviders>
        <IdleTimer
          timeout={1000 * 60 * 15}
          onIdle={this.handleOnIdle}
          debounce={250}
        />

        <div className={`app ${sidebarCollapsedClass}`}>
          <PageAlert />
          <div className="app-body">
            <SidebarNav
              nav={this.getNavByRole()}
              logo={Logo}
              logoText="QUẢN LÝ CÔNG VĂN"
              isSidebarCollapsed={sidebarCollapsed}
              toggleSidebar={this.toggleSideCollapse}
              {...this.props}
            />
            <Page>
              <Header
                toggleSidebar={this.toggleSideCollapse}
                isSidebarCollapsed={sidebarCollapsed}
                routes={routes}
                {...this.props}
              >
                <HeaderNav />
              </Header>
              <PageContent>
                <Switch>
                  <Route path="/home" component={Dashboard} />
                  {routes.map((page, key) => (
                    <Route path={page.path} component={page.component} key={key} />
                  ))}
                  {/* <Redirect from="/" to="/qldc" /> */}
                </Switch>
              </PageContent>
            </Page>
          </div>
          <Footer>
            <span>Bản quyền © 2020, Phát triển bởi ARS.</span>
            <small>Phiên bản: {fullVersion}</small>
          </Footer>
          <ToastContainer />
        </div>
      </ContextProviders>
    );
  }
}


