import React, { useRef, useState } from 'react'
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'

export const ToastNoti = ({ toast, setToast }) => {
    const toaster = useRef(null)

    return (
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster}>
            {toast && (
                <CToast onClose={() => setToast(null)}>
                    <CToastHeader closeButton>
                        <svg
                            className="rounded me-2"
                            width="20"
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                            focusable="false"
                            role="img"
                        >
                            <rect width="100%" height="100%" fill="#007aff"></rect>
                        </svg>
                        <div className="fw-bold me-auto">CoreUI for React.js</div>
                        <small>Just now</small>
                    </CToastHeader>
                    <CToastBody>Hello, world! This is a toast message.</CToastBody>
                </CToast>
            )}
        </CToaster>
    )
}
