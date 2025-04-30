import React from 'react'

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl'>{children}</div>
    )
}

export default PageLayout