import {
  ButtonType,
  IconButtonSize,
  IconType,
  InlineChildren,
  InlineChildrenJustification,
  MenuAlignment,
  MenuInteractionType,
  Spacing,
  Text,
  TextWeight,
  TextColor,
  Theme,
} from '@doordash/prism-react'
import { Menu } from '@doordash/prism-react'
import { Button, IconButton } from '@doordash/prism-react'
import { TextField } from '@doordash/prism-react'
import { LayerManager } from '@doordash/prism-react'
import { useField } from 'formik'
import _ from 'lodash'
import * as React from 'react'

import { Cron, Mode } from '../Cron'
import { FormInputProps } from '../Formik/types'

import { FooterWrapper, HeaderWrapper, Main, CronInputWrapper } from './CronExpressionInput.styles'

export type Props = {
  isDisabled?: boolean
  name: string
  label: string
  isMultiline?: boolean
  placeholder?: string
  mode?: Mode
} & FormInputProps

export const CronExpressionInput: React.FC<Props> = ({ ...props }) => {
  const [field, meta, helpers] = useField(props)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [scheduleValue, setScheduleValue] = React.useState(field.value)

  return (
    <Main>
      <Menu
        interactionType={MenuInteractionType.controlled}
        isVisible={isMenuOpen}
        menuContainerStyles={{
          padding: `${Spacing.none}px ${Spacing.large}px`,
        }}
        controlText={field.value}
        onControlClick={() => setIsMenuOpen(!isMenuOpen)}
        alignMenu={MenuAlignment.bottomLeft}
        isInline={false}
        renderMenuControl={({ accessibilityAttributes, describedBy }) => (
          <TextField
            value={field.value}
            error={meta.touched && meta.error ? meta.error : undefined}
            name={props.name}
            label={props.label}
            onChange={_.noop}
            placeholder={props.placeholder}
            renderAfterContent={() => (
              <Button
                type={ButtonType.flatSecondary}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                isDisabled={props.isDisabled}
              >
                Time Picker
              </Button>
            )}
            readOnly
            aria-describedby={describedBy}
            {...accessibilityAttributes}
          />
        )}
        content={[
          {
            customContent: (
              <HeaderWrapper>
                <InlineChildren justifyContent={InlineChildrenJustification.spaceBetween}>
                  <Text
                    size={Theme.usage.fontSize.medium}
                    weight={TextWeight.semibold}
                    color={TextColor.text.default}
                  >
                    Time Picker
                  </Text>
                  <IconButton
                    size={IconButtonSize.small}
                    iconType={IconType.Close}
                    aria-describedby={'Time Picker'}
                    accessibilityLabel="Time Picker"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </InlineChildren>
              </HeaderWrapper>
            ),
          },
          {
            customContent: (
              <Text
                size={Theme.usage.fontSize.small}
                weight={TextWeight.regular}
                color={TextColor.text.subdued.default}
              >
                Time Picker will help you build Cron Expressions to schedule execution dates.
              </Text>
            ),
          },
          {
            customContent: (
              <CronInputWrapper>
                <LayerManager>
                  <Cron
                    mode={props.mode || 'multiple'}
                    {...meta}
                    value={field?.value}
                    isReadOnly={props.isReadOnly}
                    setValue={(v: string) => {
                      setScheduleValue(v)
                      helpers.setTouched(true, true)
                    }}
                  />
                </LayerManager>
              </CronInputWrapper>
            ),
          },
          {
            customContent: (
              <FooterWrapper>
                <InlineChildren justifyContent={InlineChildrenJustification.flexEnd}>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false)
                      helpers.setValue('')
                    }}
                    type={ButtonType.tertiary}
                    isInline
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false)
                      helpers.setValue(scheduleValue)
                    }}
                    isInline
                  >
                    Submit
                  </Button>
                </InlineChildren>
              </FooterWrapper>
            ),
          },
        ]}
      />
    </Main>
  )
}

export default CronExpressionInput
