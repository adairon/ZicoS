import React from "react"
import ContentLoader from "react-content-loader" 

const ProfileLoader = () => (
  <ContentLoader 
    speed={2}
    width={1138}
    height={835}
    viewBox="0 0 1138 835"
    backgroundColor="#f0f0f0"
    foregroundColor="#555555"
  >
    <rect x="15" y="16" rx="2" ry="2" width="500" height="561" /> 
    <rect x="527" y="16" rx="2" ry="2" width="545" height="157" /> 
    <rect x="527" y="189" rx="2" ry="2" width="545" height="85" /> 
    <rect x="527" y="290" rx="2" ry="2" width="545" height="85" /> 
    <rect x="527" y="391" rx="2" ry="2" width="545" height="85" /> 
    <rect x="15" y="593" rx="2" ry="2" width="1108" height="99" /> 
    <rect x="15" y="708" rx="2" ry="2" width="1108" height="99" />
  </ContentLoader>
)

export default ProfileLoader