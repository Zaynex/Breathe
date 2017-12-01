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
const routes = [{
  path: '/lazyload',
  extra: false,
  component: ScrollLoadResource
}, {
  path: '/canvas',
  extra: false,
  component: ColorPicker
}]

const RouteConfig = () => (
  <Router >
    <div>
      <ul>
        <li><Link to="/lazyload">LzayLoad</Link></li>
        <li><Link to="/canvas">Canvas</Link></li>
      </ul>
      <Switch>
        {routes.map(({ component, path, extra }) => {
          return <Route path={path} component={component} key={path} extra={extra} />
        })}
        <Redirect from="/" to="/lazyload" />
      </Switch>
    </div>
  </Router>
)

export default RouteConfig