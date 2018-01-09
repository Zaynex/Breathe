import React from 'react'
import { SlideBar, Animation, AutoLoad } from '../Components'
export default () => (
  <div>
    <SlideBar />
    {IMGLIST.map(src => <AutoLoad src={src} key={src} />)}
  </div>
)

const IMGLIST = [
  'https://modao.cc/images/landing/homepage/new/en/workspace.png?20171012b',
  'https://modao.cc/images/landing/homepage/new/en/sec3.png?20171012b',
  'https://modao.cc/images/landing/homepage/new/en/sec4.png?20171012b',
  'https://modao.cc/images/landing/homepage/new/en/sec5.png?20171012b',
  'https://modao.cc/images/landing/homepage/new/en/sec6.png?20171012b',
  'https://modao.cc/images/landing/homepage/new/en/sec7.png?20171012b',
  'https://cdn.dribbble.com/users/994264/screenshots/3774430/_illom.png',
  'https://cdn.dribbble.com/users/237905/screenshots/4077568/nova-checkout-process.gif',
  'https://cdn.dribbble.com/users/63407/screenshots/4075904/dribbble_style_women_3.png'
]