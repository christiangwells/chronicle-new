import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '~/lib/utils'

interface QuillProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: 'default' | 'subtle'
}

const bodyClasses = cva('', {
  variants: {
    variant: {
      default: 'fill-orange-200 dark:fill-orange-950/30',
      subtle: 'fill-orange-100 dark:fill-orange-950/20',
    },
  },
  defaultVariants: { variant: 'default' },
})

const lineClasses = cva('', {
  variants: {
    variant: {
      default: 'fill-orange-600 dark:fill-orange-400',
      subtle: 'fill-orange-500 dark:fill-orange-500',
    },
  },
  defaultVariants: { variant: 'default' },
})

const Quill = ({ className, variant = 'default', ...props }: QuillProps) => {
  const bodyClass = bodyClasses({ variant })
  const lineClass = lineClasses({ variant })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 511.993 511.993"
      className={cn('size-6', className)}
      {...props}
    >
      <path
        d="M356.506 273.935c4.506-4.403 6.707-10.103 6.204-16.026-1.152-13.585-15.403-23.45-31.898-34.876-3.831-2.654-9.045-6.263-13.338-9.609 8.277-.307 23.595-.154 38.076.137 8.866.171 17.698.341 25.66.341 25.779 0 35.849-1.417 41.003-9.353 40.67-62.805 69.811-127.838 76.041-169.728l3.507-23.484-21.547 9.984C302.277 103.797 147.072 246.679 54.392 413.318l-10.641 19.123 21.888-.102c30.421-.145 141.286-12.006 290.867-158.404z"
        className={bodyClass}
      />
      <path
        d="M7.928 511.033c1.587.649 3.234.956 4.855.956 5.018 0 9.788-3.004 11.819-7.927 8.311-20.25 17.792-40.149 27.87-59.827.316.06.58.282.896.333 0 0 3.951.597 11.537.597 31.65 0 146.867-11.691 300.51-162.065 7.287-7.125 10.837-16.452 10.01-26.266-1.058-12.527-8.525-21.956-18.569-30.447 8.422.162 16.777.316 24.354.316 26.052 0 42.539-1.024 51.703-15.181 9.95-15.369 82.978-130.91 78.916-197.769 0 0-.64-3.977-1.562-6.084-2.799-6.451-10.308-9.421-16.828-6.596C272.197 97.687 88.099 282.084.965 494.308c-2.688 6.554.435 14.029 6.963 16.725zm477.67-478.097c-5.76 38.673-33.05 101.205-74.129 164.651-1.818 2.807-14.251 3.507-30.251 3.507-15.812 0-35.106-.683-51.081-.683-16.299 0-29.141.708-31.317 3.575-12.74 16.768 65.758 44.143 48.734 60.8C201.72 407.524 95.787 419.394 65.579 419.539 157.022 255.11 308.173 115.172 485.598 32.936z"
        className={lineClass}
      />
    </svg>
  )
}

export { Quill }
