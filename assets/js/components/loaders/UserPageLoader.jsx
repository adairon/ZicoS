import React from "react"
import ContentLoader from "react-content-loader" 

const UserPageLoader = () => (
  <ContentLoader 
    speed={2}
    width={1044}
    height={200}
    viewBox="0 0 1044 200"
    backgroundColor="#f0f0f0"
    foregroundColor="#555555"
  >
    <rect x="0" y="0" rx="2" ry="2" width="1044" height="89" />
    <rect x="348" y="129" rx="2" ry="2" width="150" height="35" /> 
    <rect x="546" y="129" rx="2" ry="2" width="160" height="35" /> 
  </ContentLoader>
)

export default UserPageLoader