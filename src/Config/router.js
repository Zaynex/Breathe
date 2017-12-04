import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import ScrollLoadResource from '../ScrollLoadResource'
import ColorPicker from '../ColorPicker'
import LazyLoad from '../LazyLoad'
import TestPicker from '../TestPicker'
const routes = [{
  path: '/canvas',
  extra: false,
  component: ColorPicker
}, {
  path: '/lazy',
  extra: false,
  component: LazyLoad
}, {
  path: '/picker',
  component: TestPicker
}]

const RouteConfig = () => (
  <Router >
    <div>
      <ul>
        <li><Link to="/lazy">Lazy</Link></li>
        <li><Link to="/picker">TestPicker</Link></li>

      </ul>
      <Switch>
        {routes.map(({ component, path, extra }) => {
          return <Route path={path} component={component} key={path} extra={extra} />
        })}
        <Redirect from="/" to="/picker" />
      </Switch>
    </div>
  </Router>
)

export default RouteConfig