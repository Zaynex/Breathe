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
const routes = [{
  path: '/scroll',
  extra: false,
  component: ScrollLoadResource
}, {
  path: '/canvas',
  extra: false,
  component: ColorPicker
}, {
  path: '/lazy',
  extra: false,
  component: LazyLoad
}]

const RouteConfig = () => (
  <Router >
    <div>
      <ul>
        <li><Link to="/srcoll">ScrollLoadResource</Link></li>
        <li><Link to="/canvas">Canvas</Link></li>
        <li><Link to="/lazy">Lazy</Link></li>
      </ul>
      <Switch>
        {routes.map(({ component, path, extra }) => {
          return <Route path={path} component={component} key={path} extra={extra} />
        })}
        <Redirect from="/" to="/scroll" />
      </Switch>
    </div>
  </Router>
)

export default RouteConfig