import React from 'react'

function Sample() {
    const myList=[
        {id:1,name:"Santhosh",age:22},
        {id:2,name:"Sandhiya",age:24},
        {id:4,name:"Anitha",age:20}

    ]
  return (
    <div>
        {   <ol>
            {myList.map((item)=>
                <li key={item.id}>Name: {item.name }, Age: {item.age}</li>
            )
        }
            </ol>
        }
    </div>
  )
}

export default Sample