import { Text, TextColor, TextWeight, Theme } from '@doordash/prism-react'
import * as React from 'react'

import { Main, ValueWrapper } from './ReadOnlyTextField.styles'

export interface Props {
  label: string
  value: string | number
  isMultiline?: number
  hint?: React.ReactNode
}

// todo: replace with theme token
const FIELD_HEIGHT = 48

export const ReadOnlyTextField: React.FC<Props> = ({ label, value, isMultiline, hint }) => {
  const valueHeight = isMultiline && Number.isInteger(isMultiline) ? FIELD_HEIGHT * isMultiline : FIELD_HEIGHT
  return (
    <Main>
      <Text size={Theme.usage.fontSize.medium} weight={TextWeight.semibold} color={TextColor.text.default}>
        {label}
      </Text>
      <ValueWrapper style={{ minHeight: `${valueHeight}px` }}>
        <Text size={Theme.usage.fontSize.medium} weight={TextWeight.regular} color={TextColor.text.default}>
          {value}
        </Text>
      </ValueWrapper>
      {hint && (
        <Text
          size={Theme.usage.fontSize.small}
          weight={TextWeight.regular}
          color={TextColor.text.subdued.default}
        >
          {hint}
        </Text>
      )}
    </Main>
  )
}

export default ReadOnlyTextField
