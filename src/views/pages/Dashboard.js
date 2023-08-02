import React, { Component } from 'react';
import reactFeature from '../../assets/images/react-feature.svg';
import sassFeature from '../../assets/images/sass-feature.svg';
import bootstrapFeature from '../../assets/images/bootstrap-feature.svg';
import responsiveFeature from '../../assets/images/responsive-feature.svg';
import { Card, CardBody, Row, Col } from 'reactstrap';
import QLGH from '../../assets/images/432382.svg'
import QLTH from '../../assets/images/432393.svg'
import QLVD from '../../assets/images/432446.svg'
import QLDC from '../../assets/images/432435.svg'
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Dashboard extends Component {
  render() {
    const heroStyles = {
      padding: '50px 0 70px'
    };

    const _functions = [
      {
        name: "Quản lý đợt cấp",
        desc: "Hỗ trợ quản lý đợt cấp",
        icon: QLDC,
        path: "/qldc"
      },
      {
        name: "Quản lý vòng đời CTS",
        desc: "Hỗ trợ quản lý vòng đời chứng thư số",
        icon: QLVD,
        path: "/qlvdcts"
      },
      {
        name: "Quản lý thu hồi",
        desc: "Hỗ trợ các chức năng thu hồi",
        icon: QLTH,
        path: "/qlth"
      },
      {
        name: "Quản lý gia hạn TĐTT",
        desc: "Phục vụ các hoạt động gia hạn TĐTT",
        icon: QLGH,
        path: "/qlghtdtt"
      }
    ]

    const panel = () => {
      return (
        _functions.map((item, i) => {
          return(
            <Col md={6} key={i}>
              <NavLink to={item.path}>
                <Card>
                  <CardBody className="display-flex">
                    <img
                      src={item.icon}
                      style={{ width: 70, height: 70, padding: '.5rem' }}
                      alt="react.js"
                      aria-hidden={true}
                    />
                    <div className="m-l">
                      <h2 className="h4">{item.name}</h2>
                      <p className="text-muted">
                        {item.desc}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </NavLink>
            </Col>
          )
        })
      )
    }

    const userInfo = cookies.get("userInfo") || '{}';

    return (
      <div>
        <Row>
          <Col md={7}>
            <div className="home-hero" style={heroStyles}>
              <h2>Ứng dụng quản lý công văn</h2>
              <p className="text-muted">
                Chào mừng <strong>{userInfo.userName}</strong> đến với ứng dụng quản lý công văn.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
            {panel()}
        </Row>
      </div>
    );
  }
}

export default Dashboard;
