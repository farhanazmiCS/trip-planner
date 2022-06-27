import React from 'react'

function Or() {
  return (
    <div
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
    >
        <div style={{flex: 1, height: '1px', backgroundColor: '#EFEFEF'}} />
        <div>
        <p style={{width: '70px', textAlign: 'center', color: 'grey'}}>or</p>
        </div>
        <div style={{flex: 1, height: '1px', backgroundColor: '#EFEFEF'}} />
    </div>
  )
}

export default Or