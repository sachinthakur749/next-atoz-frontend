import React from 'react'

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='max-w-[1200px] mx-auto'>{children}</div>
    )
}

export default PageLayout