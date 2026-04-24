import { Check, Copy } from 'lucide-react'
import * as React from 'react'

import * as S from './CopyButton.styles'

type CopyButtonProps = {
  url: string | undefined
}

export const CopyButton: React.FC<CopyButtonProps> = ({ url }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopyLink = React.useCallback(() => {
    if (url) {
      setCopied(true)
      navigator.clipboard.writeText(url).catch((error) => {
        console.error('Failed to copy link:', error)
      })
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [url])

  return (
    <S.ActionButton onClick={handleCopyLink} title={copied ? 'Copied!' : 'Copy link'}>
      <S.IconWrapper>
        <S.CopyIcon $visible={!copied}>
          <Copy size={16} />
        </S.CopyIcon>
        <S.CheckIcon $visible={copied}>
          <Check size={16} />
        </S.CheckIcon>
      </S.IconWrapper>
    </S.ActionButton>
  )
}
