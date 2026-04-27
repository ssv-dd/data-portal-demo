import React from 'react'

import * as S from './Skeleton.styles'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <S.SkeletonBase className={className} {...props} />
}

export { Skeleton }
