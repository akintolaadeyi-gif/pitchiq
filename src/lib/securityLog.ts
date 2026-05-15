type SecurityEvent =
  | 'RATE_LIMIT_HIT'
  | 'INVALID_TOKEN'
  | 'FAILED_LOGIN'
  | 'SIGNUP_SPAM'
  | 'INVALID_INPUT'
  | 'SUSPICIOUS_REQUEST'

interface SecurityAlert {
  event: SecurityEvent
  ip: string
  path: string
  detail?: string
  timestamp: string
}

const recentAlerts = new Map<string, number>()

export function logSecurityEvent(alert: Omit<SecurityAlert, 'timestamp'>) {
  const timestamp = new Date().toISOString()
  const full: SecurityAlert = { ...alert, timestamp }

  // Always log to console (visible in your terminal)
  const icon = alert.event === 'RATE_LIMIT_HIT' ? '🚨' :
               alert.event === 'FAILED_LOGIN' ? '⚠️' :
               alert.event === 'INVALID_TOKEN' ? '🔐' : '🛡️'

  console.warn(`\n${icon}  SECURITY ALERT [${timestamp}]`)
  console.warn(`   Event  : ${alert.event}`)
  console.warn(`   IP     : ${alert.ip}`)
  console.warn(`   Path   : ${alert.path}`)
  if (alert.detail) console.warn(`   Detail : ${alert.detail}`)
  console.warn('')

  // Escalate if same IP triggers 10+ alerts in 5 minutes
  const key = `${alert.ip}:escalate`
  const count = (recentAlerts.get(key) || 0) + 1
  recentAlerts.set(key, count)
  setTimeout(() => recentAlerts.set(key, Math.max(0, (recentAlerts.get(key) || 1) - 1)), 5 * 60 * 1000)

  if (count >= 10) {
    console.error(`\n🔴 CRITICAL: IP ${alert.ip} has triggered ${count} security events in 5 minutes!`)
    console.error(`   Consider blocking this IP immediately.\n`)
  }
}
