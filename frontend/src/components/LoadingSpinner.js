import { useState, useEffect } from 'react'
import styles from './modules/LoadingSpinner.modules.css'

export default function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} >
      </div>
    </div>
  )
}
