import React from 'react'
import ReactDatePicker from 'react-datepicker'
import styled from '@emotion/styled'

const StyledDatePicker = styled.div`
  & .react-datepicker-wrapper {
    width: 100%;
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.5rem;
    border-radius: 0.25rem;
    border: 1px solid;
    border-color: #e2e8f0;
    background-color: #fff;
    margin-bottom: 0.75rem;
    appearance: none;
    transition: all 0.2s;
    outline: none;
    align-items: center;
    display: flex;
  }
  & .react-datepicker-ignore-onclickoutside,
  & .react-datepicker__input-container,
  & .react-datepicker__input-container input {
    width: 100%;
  }
`

export const DatePicker = ({ selected, onChange }) => {
  return (
    <StyledDatePicker>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MM/dd/yyyy h:mm aa"
      />
    </StyledDatePicker>
  )
}

export default DatePicker
