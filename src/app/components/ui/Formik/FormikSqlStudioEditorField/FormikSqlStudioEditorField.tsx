import {
  InlineChildren,
  InlineChildrenAlignment,
  InlineChildrenSize,
  StackChildren,
  StackSize,
  Text,
  TextSize,
  TextWeight,
} from '@doordash/prism-react'
import { FieldHookConfig, useField } from 'formik'
import { AlignLeft } from 'lucide-react'
import * as React from 'react'

import { useAppContext } from '../../../../app/AppContext'
import * as TB from '../../../../features/SQLStudio/components/SQLEditor/CodeToolBar/CodeToolBar.styles'
import { SnowflakeBrandIcon } from '../../../../features/SQLStudio/components/SQLEditor/CodeToolBar/SqlEngineBrandIcons'
import { SQLMonacoEditor } from '../../../../features/SQLStudio/components/SQLEditor/SQLMonacoEditor'
import { createSqlStudioMonacoEditorThemeFromPrism } from '../../../../features/SQLStudio/components/SQLEditor/sqlMonaco/sqlStudioMonacoEditorTheme'
import { resolveMonacoEditorTheme } from '../../../../features/SQLStudio/constants/sqlStudioUi'
import { formatSQL } from '../../../../features/SQLStudio/utils/formatSqlEditorText'
import TextError from '../../TextError'

import * as S from './FormikSqlStudioEditorField.styles'

const FORMAT_ICON = 16

type FormikSqlStudioEditorFieldProps = {
  readonly id: string
  readonly name: string
  /** When omitted, use `editorAriaLabel` and render the label outside this component. */
  readonly label?: string
  /** Passed to Monaco when `label` is omitted (external label). */
  readonly editorAriaLabel?: string
  readonly editorMinHeight?: string
  readonly hint?: React.ReactNode
  readonly onBlur?: () => void
} & FieldHookConfig<string>

function ToolbarIconTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false)
  return (
    <TB.ToolbarTooltipHost
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={() => setVisible(true)}
      onBlurCapture={() => setVisible(false)}
    >
      {children}
      <TB.ToolbarTooltipBubble $visible={visible} role="tooltip" aria-hidden={!visible}>
        {label}
      </TB.ToolbarTooltipBubble>
    </TB.ToolbarTooltipHost>
  )
}

export function FormikSqlStudioEditorField({
  id,
  name,
  label,
  editorAriaLabel,
  editorMinHeight = 'min(480px, 50vh)',
  hint,
  onBlur,
  ...rest
}: FormikSqlStudioEditorFieldProps) {
  const [, meta, helpers] = useField<string>({ name, ...rest })
  const { themeMode } = useAppContext()
  const [isFormatted, setIsFormatted] = React.useState<boolean | undefined>(false)
  const [formatError, setFormatError] = React.useState<string | null>(null)
  const labelId = label ? `${id}-label` : undefined

  const resolvedMonacoTheme = React.useMemo(
    () => resolveMonacoEditorTheme('system', themeMode === 'dark' ? 'dark' : 'light'),
    [themeMode]
  )

  const sqlStudioMonacoEditorTheme = React.useMemo(() => {
    void themeMode
    return createSqlStudioMonacoEditorThemeFromPrism()
  }, [themeMode])

  const handleEditorBlur = React.useCallback(() => {
    void helpers.setTouched(true)
    onBlur?.()
  }, [helpers, onBlur])

  const handleChange = React.useCallback(
    (next: string) => {
      setFormatError(null)
      void helpers.setValue(next)
    },
    [helpers]
  )

  const handleFormat = React.useCallback(() => {
    const raw = meta.value ?? ''
    if (!raw.trim()) {
      return
    }
    try {
      const formatted = formatSQL(raw, 'snowflake')
      void helpers.setValue(formatted)
      setIsFormatted(true)
      setFormatError(null)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to format SQL'
      setFormatError(message)
    }
  }, [helpers, meta.value])

  const showFieldError = Boolean(meta.touched && meta.error) || Boolean(formatError)

  return (
    <StackChildren size={StackSize.xxxSmall}>
      {label ? (
        <Text id={labelId} weight={TextWeight.bold} size={TextSize.small}>
          {label}
        </Text>
      ) : null}
      <S.SqlEditorInputShell $hasError={showFieldError}>
        <S.EditorChrome $minHeight={editorMinHeight}>
          <TB.CodeToolBarRoot role="toolbar" aria-label="SQL query tools">
            <TB.ToolbarLeftCluster>
              <InlineChildren size={InlineChildrenSize.xxSmall} alignItems={InlineChildrenAlignment.center}>
                <SnowflakeBrandIcon size={16} />
                <Text size={TextSize.small} weight={TextWeight.semibold}>
                  Snowflake
                </Text>
                <TB.ClassicEngineBadge>Classic</TB.ClassicEngineBadge>
              </InlineChildren>
            </TB.ToolbarLeftCluster>
            <TB.ActionsGroup>
              <ToolbarIconTooltip label="Format SQL">
                <TB.ToolbarIconOnlyButton type="button" aria-label="Format SQL" onClick={handleFormat}>
                  <AlignLeft size={FORMAT_ICON} strokeWidth={2} aria-hidden />
                </TB.ToolbarIconOnlyButton>
              </ToolbarIconTooltip>
            </TB.ActionsGroup>
          </TB.CodeToolBarRoot>
          <S.MonacoArea>
            <SQLMonacoEditor
              monacoTheme={resolvedMonacoTheme}
              editorTheme={sqlStudioMonacoEditorTheme}
              value={(meta.value ?? '').replaceAll('\\n', '\n')}
              onChange={handleChange}
              aria-labelledby={labelId}
              ariaLabel={labelId ? undefined : editorAriaLabel}
              onEditorBlur={handleEditorBlur}
              isFormatted={isFormatted}
              setFormatted={setIsFormatted}
            />
          </S.MonacoArea>
        </S.EditorChrome>
      </S.SqlEditorInputShell>
      {formatError ? <TextError message={formatError} /> : null}
      {meta.touched && meta.error ? <TextError message={meta.error} /> : null}
      {hint}
    </StackChildren>
  )
}
