import { StackChildren, StackSize, Text, TextSize, TextWeight } from '@doordash/prism-react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { FieldHookConfig, useField } from 'formik'
import * as React from 'react'

import TextError from '../../TextError'

import * as S from './FormikMonacoField.styles'

type FormikMonacoFieldProps = {
  id: string
  name: string
  label?: string
  /** Monaco language id (e.g. `json`, `sql`). Defaults to `json`. */
  language?: string
  editorHeight?: string
  hint?: React.ReactNode
  onBlur?: () => void
} & FieldHookConfig<string>

const FormikMonacoField: React.FC<FormikMonacoFieldProps> = ({
  id,
  name,
  label,
  language = 'json',
  editorHeight = '180px',
  hint,
  onBlur,
  ...rest
}) => {
  const [, meta, helpers] = useField<string>({ name, ...rest })

  const handleMount = React.useCallback<OnMount>(
    (editor) => {
      editor.onDidBlurEditorWidget(() => {
        void helpers.setTouched(true)
        onBlur?.()
      })
    },
    [helpers, onBlur]
  )

  return (
    <StackChildren size={StackSize.xxxSmall}>
      {label ? (
        <Text weight={TextWeight.bold} size={TextSize.small}>
          {label}
        </Text>
      ) : null}
      <S.MonacoWrap $hasError={Boolean(meta.touched && meta.error)}>
        <Editor
          height={editorHeight}
          defaultLanguage={language}
          theme="vs"
          path={id}
          value={meta.value ?? ''}
          onChange={(value) => {
            void helpers.setValue(value ?? '')
          }}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </S.MonacoWrap>
      {meta.touched && meta.error ? <TextError message={meta.error} /> : null}
      {hint}
    </StackChildren>
  )
}

export default FormikMonacoField
