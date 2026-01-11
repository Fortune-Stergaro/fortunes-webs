
import {  groq } from 'next-sanity'



// We rename 'avatar.asset->url' to just 'url' to match your component props

export const viewersQuery = groq`
  *[_type == "viewer"] {
    _id,
    username,
    "url": avatar.asset->url
  }
`
