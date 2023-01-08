import React, { FC, SetStateAction } from 'react'
import cl from './Pagination.module.scss'

interface IProps {
  limit?: number
  totalCount: number
  currentPage: number
  setCurrentPage: React.Dispatch<SetStateAction<number>>
}

const Pagination: FC<IProps> = ({
  limit = 10,
  totalCount,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalCount / limit)

  if (totalPages <= 1) return <></>

  const totalPagesArray = new Array(totalPages)
    .fill(undefined)
    .map((el, idx) => idx + 1)

  return (
    <ul className={cl.menu}>
      {totalPages <= 7 ? (
        totalPagesArray.map(el => (
          <li
            key={el}
            style={{
              backgroundColor: currentPage === el ? '#2d3748' : '',
            }}
            onClick={() => setCurrentPage(el)}
          >
            {el}
          </li>
        ))
      ) : (
        <>
          {currentPage < totalPagesArray.length - 1 &&
            totalPagesArray
              .slice(
                currentPage === 1 ? 0 : currentPage - 2,
                currentPage === 1 ? 3 : currentPage + 1
              )
              .map(el => (
                <li
                  key={el}
                  style={{
                    backgroundColor: currentPage === el ? '#2d3748' : '',
                  }}
                  onClick={() => setCurrentPage(el)}
                >
                  {el}
                </li>
              ))}
          {currentPage < totalPagesArray.length - 1 && <p>...</p>}
          {totalPagesArray
            .slice(totalPagesArray.length - 3, totalPagesArray.length)
            .map(el => (
              <li
                key={el}
                style={{
                  backgroundColor: currentPage === el ? '#2d3748' : '',
                }}
                onClick={() => setCurrentPage(el)}
              >
                {el}
              </li>
            ))}
        </>
      )}
    </ul>
  )
}

export default Pagination
