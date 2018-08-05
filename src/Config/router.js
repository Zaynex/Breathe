import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import LazyLoad from '../LazyLoad'
import Playground from '../Playground'
import TestPicker from '../TestPicker'
import SimpleMotion from '../SimpleMotion'
const routes = [{
  path: '/lazy',
  extra: false,
  component: LazyLoad
}, {
  path: '/picker',
  component: TestPicker
}, {
  path: '/playgroud',
  component: Playground
}, {
  path: '/motion',
  component: SimpleMotion
}]

const RouteConfig = () => (
  <Router >
    <div>
      <ul>
        <li><Link to="/lazy">Lazy</Link></li>
        <li><Link to="/picker">TestPicker</Link></li>
        <li><Link to="/playgroud">Playground</Link></li>
        <li><Link to="/motion">SimpleMotion</Link></li>
      </ul>
      <Switch>
        {routes.map(({ component, path, extra }) => {
          return <Route path={path} component={component} key={path} extra={extra} />
        })}
      </Switch>
    </div>
  </Router>
)

export default RouteConfig