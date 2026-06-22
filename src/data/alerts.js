// GuardianAI — 10 Simulated Alert Objects
// Source: structure and confidence patterns modeled on Hugging Face zero-shot
// classification (facebook/bart-large-mnli) + synthetic IT telemetry generated
// via Python Faker, per hackathon-approved dataset list (Section 6).
export const alerts = [
  {
    id: 'ALT001',
    deviceName: 'DELL-WS-4821',
    deviceModel: 'Dell OptiPlex 7090 Gen 3',
    department: 'Finance',
    alertType: 'Critical Patch KB5034441 Missing',
    category: 'Security',
    confidenceLevel: 'HIGH',
    confidenceScore: 94,
    confidenceDriver: 'Strong match to 342 devices with identical OS version and patch history.',
    reasoningSteps: [
      '🔴 3 similar devices in your fleet suffered ransomware exposure after skipping this exact patch last week',
      '📅 This device is 14 days overdue — past your fleet\'s standard 7-day patch window',
      '💻 OS version 22H2 falls squarely in Microsoft\'s affected range for this vulnerability',
      '✅ No custom software conflicts detected in device telemetry — safe to proceed',
    ],
    timelineEvents: [
    {
      time: "14 days ago",
      event: "Device exceeded patch window"
    },
    {
      time: "Last week",
      event: "3 similar devices experienced ransomware exposure"
    },
    {
      time: "Today",
      event: "GuardianAI generated recommendation"
    }
  ],
    dataSource: 'Telemetry from 342 similar fleet devices (Dell OptiPlex 7090, Win 11 22H2) over 14 days',
    limitations: 'Recommendation not validated on this specific hardware revision (Gen 3 BIOS 1.18.0). Patch rollback has not been tested on this exact configuration.',
    recommendedAction: 'Apply patch KB5034441 during next maintenance window (within 24 hrs recommended)',
    status: 'PENDING',
    timestamp: '2026-03-15T08:32:00Z',
    severity: 'CRITICAL',
    estimatedImpact: 'High — CVE-2026-21307 actively exploited in the wild',
    counterfactual: 'If this device had received the patch 7 days ago instead of 14, confidence would drop to MEDIUM.',
  },
  {
    id: 'ALT002',
    deviceName: 'DELL-LT-7734',
    deviceModel: 'Dell Latitude 5530',
    department: 'Engineering',
    alertType: 'Unusual Login — Off-Hours Access at 3:14 AM',
    category: 'Security',
    confidenceLevel: 'HIGH',
    confidenceScore: 89,
    confidenceDriver: 'Deviation from 90-day baseline login pattern is statistically significant (z-score 4.2).',
    reasoningSteps: [
      '🕒 Login occurred at 03:14 AM — user\'s 90-day baseline shows 100% logins between 8 AM–7 PM',
      '🌍 IP geolocation: Mumbai, India — user\'s registered location is Austin, TX (9,000 km apart)',
      '🔑 2 failed password attempts preceded the successful login at this IP',
      '📊 2 similar anomalies in your fleet this week were confirmed credential compromise incidents',
    ],
    timelineEvents: [
      {
        time: "90 days ago",
        event: "Normal login pattern established (8 AM–7 PM)"
      },
      {
        time: "03:14 AM",
        event: "Off-hours login detected from Mumbai"
      },
      {
        time: "Moments later",
        event: "2 failed password attempts recorded"
      },
      {
        time: "Today",
        event: "GuardianAI recommended account protection"
      }
    ],
    dataSource: 'Login telemetry from 89 similar user profiles in the fleet over 90 days',
    limitations: 'VPN exit node IPs are indistinguishable from attacker IPs in this dataset. User may be travelling. No MFA challenge was triggered (MFA not enrolled on this account).',
    recommendedAction: 'Force password reset and temporarily suspend session pending admin verification',
    status: 'PENDING',
    timestamp: '2026-03-15T07:58:00Z',
    severity: 'CRITICAL',
    estimatedImpact: 'High — potential account compromise',
    counterfactual: 'If the user had submitted a travel request for India via HR systems, confidence would drop to LOW.',
  },
  {
    id: 'ALT003',
    deviceName: 'DELL-WS-2291',
    deviceModel: 'Dell Precision 3660',
    department: 'Design',
    alertType: 'SSD Health Critical — 8% Remaining Life',
    category: 'Hardware',
    confidenceLevel: 'HIGH',
    confidenceScore: 97,
    confidenceDriver: 'SMART data is a direct hardware measurement — no inference required.',
    reasoningSteps: [
      '💾 S.M.A.R.T. attribute 231 (SSD Life Left) reads 8% — below the 15% replacement threshold',
      '📈 Wear rate over last 30 days suggests complete failure within 12–18 days',
      '⚠️ 47 reallocated sectors detected — early sign of physical media degradation',
      '📁 Last backup recorded 9 days ago — data loss risk is elevated if drive fails before next backup',
    ],
    timelineEvents: [
      {
        time: "30 days ago",
        event: "SSD wear rate began increasing"
      },
      {
        time: "7 days ago",
        event: "SMART warnings exceeded safe threshold"
      },
      {
        time: "Today",
        event: "Failure risk projected within 12–18 days"
      },
      {
        time: "Today",
        event: "Replacement recommendation generated"
      }
    ],
    dataSource: 'Direct SMART telemetry from device hardware + failure rate data from 156 similar drives',
    limitations: 'SMART predictions have a ±20% accuracy window. Drive may fail earlier or later than predicted. Backup currency unknown after most recent check.',
    recommendedAction: 'Order replacement SSD immediately and schedule migration within 72 hours',
    status: 'APPROVED',
    timestamp: '2026-03-14T16:20:00Z',
    severity: 'HIGH',
    estimatedImpact: 'Medium — data loss risk if backup not current',
    humanDecision: 'APPROVED',
    decisionBy: 'Alex Chen',
    decisionTime: '2026-03-14T16:35:00Z',
    outcome: 'Replacement ordered — arrival in 2 business days',
    counterfactual: 'If the S.M.A.R.T. SSD Life Left attribute remained above 15%, this alert would not have triggered.',
  },
  {
    id: 'ALT004',
    deviceName: 'DELL-LT-0093',
    deviceModel: 'Dell Latitude 7430',
    department: 'Legal',
    alertType: 'Unlicensed Software Detected — Adobe Photoshop CC',
    category: 'Compliance',
    confidenceLevel: 'MEDIUM',
    confidenceScore: 76,
    confidenceDriver: 'Software fingerprint matched, but license registry sync is 48 hrs behind.',
    reasoningSteps: [
      '🔍 Software fingerprint matches Adobe Photoshop CC 2026 (unlicensed build signature)',
      '📋 Device\'s assigned license pool shows 0 available Photoshop seats as of last sync',
      '⏱️ License registry last synced 48 hours ago — a new seat may have been assigned since',
      '📌 3 similar flagged devices this month were confirmed true unlicensed installs',
    ],
    timelineEvents: [
      {
        time: "48 hours ago",
        event: "License registry last synchronized"
      },
      {
        time: "Today",
        event: "Photoshop installation detected"
      },
      {
        time: "Today",
        event: "No available license seat found"
      },
      {
        time: "Today",
        event: "Verification recommendation generated"
      }
    ],
    dataSource: 'Software inventory from 2,400 fleet devices + license registry (48-hr old snapshot)',
    limitations: 'License database sync lag (48 hrs) means this may be a false positive if a license was recently assigned. Adobe volume license metadata is not always reliably reported by this version of the DLMS agent.',
    recommendedAction: 'Verify license assignment in Adobe Admin Console before removing software',
    status: 'PENDING',
    timestamp: '2026-03-15T09:10:00Z',
    severity: 'MEDIUM',
    estimatedImpact: 'Medium — compliance risk and potential audit exposure',
    counterfactual: 'If the license registry had synced within the last 4 hours, confidence would increase to HIGH.',
  },
  {
    id: 'ALT005',
    deviceName: 'DELL-WS-1156',
    deviceModel: 'Dell OptiPlex 5090',
    department: 'HR',
    alertType: 'Memory Usage Spike — 94% RAM for 6+ Hours',
    category: 'Performance',
    confidenceLevel: 'MEDIUM',
    confidenceScore: 71,
    confidenceDriver: 'Sustained spike pattern matches memory leak signature, but process isolation is uncertain.',
    reasoningSteps: [
      '📊 RAM usage sustained above 94% for 6 consecutive hours — 3× the device\'s typical peak',
      '🔎 Top consumer: svchost.exe (Windows Update) — 4.1 GB allocated, not releasing',
      '🔄 12 similar cases this month resolved by restarting Windows Update service',
      '🖥️ No user activity detected for last 2 hours — low interruption risk for restart',
    ],
    timelineEvents: [
      {
        time: "6 hours ago",
        event: "RAM usage exceeded 94%"
      },
      {
        time: "4 hours ago",
        event: "Windows Update service identified as top consumer"
      },
      {
        time: "2 hours ago",
        event: "No user activity detected"
      },
      {
        time: "Today",
        event: "Service restart recommended"
      }
    ],
    dataSource: 'Performance telemetry from 2,400 devices over 30 days + process analysis from 67 similar incidents',
    limitations: 'Root cause may be a third-party application, not Windows Update. Restarting the service will interrupt any active update downloads. AI cannot confirm whether data loss would occur without process-level inspection.',
    recommendedAction: 'Restart Windows Update service (net stop wuauserv) remotely — low risk during off-hours',
    status: 'PENDING',
    timestamp: '2026-03-15T06:45:00Z',
    severity: 'MEDIUM',
    estimatedImpact: 'Low — performance degradation, no data loss expected',
    counterfactual: 'If active user input (mouse/keyboard) was detected in the last 15 minutes, confidence would drop to LOW.',
  },
  {
    id: 'ALT006',
    deviceName: 'DELL-LT-3342',
    deviceModel: 'Dell Latitude 5430',
    department: 'Sales',
    alertType: 'Encryption Disabled — BitLocker Deactivated',
    category: 'Security',
    confidenceLevel: 'HIGH',
    confidenceScore: 99,
    confidenceDriver: 'BitLocker status is a direct registry read — binary state, no inference.',
    reasoningSteps: [
      '🔓 BitLocker status: FULLY DECRYPTED — confirmed via direct WMI query (not estimated)',
      '📜 Company policy DEL-SEC-007 mandates full-disk encryption on all portable devices',
      '🕵️ Deactivation event logged at 2026-03-13 22:47 — no change ticket exists for this device',
      '⚖️ 2 similar incidents in Q1 2026 resulted in compliance violations and audit findings',
    ],
    timelineEvents: [
      {
        time: "2 days ago",
        event: "BitLocker deactivation event logged"
      },
      {
        time: "2 days ago",
        event: "No approved change ticket found"
      },
      {
        time: "Today",
        event: "Compliance violation detected"
      },
      {
        time: "Today",
        event: "Re-enable encryption recommended"
      }
    ],
    dataSource: 'Direct WMI query to device (real-time) + policy compliance database + change ticket system',
    limitations: 'The AI cannot determine WHY BitLocker was disabled — could be admin action, user action, or failed update. Enabling BitLocker will trigger a full disk encryption pass (2–4 hrs on this device size).',
    recommendedAction: 'Re-enable BitLocker immediately and flag for security review',
    status: 'OVERRIDDEN',
    timestamp: '2026-03-14T10:05:00Z',
    severity: 'CRITICAL',
    estimatedImpact: 'Critical — regulatory compliance violation (GDPR, SOC 2)',
    humanDecision: 'OVERRIDDEN',
    overrideReason: 'I have additional context',
    overrideNotes: 'IT team is migrating this device to a new encryption solution — temporary decryption is authorized per CAB-2026-0312.',
    decisionBy: 'Alex Chen',
    decisionTime: '2026-03-14T10:22:00Z',
    outcome: 'Escalated to Security team for monitoring during migration window',
    counterfactual: 'If an approved change ticket existed for this device\'s temporary decryption, the alert would have been suppressed.',
  },
  {
    id: 'ALT007',
    deviceName: 'DELL-WS-8812',
    deviceModel: 'Dell OptiPlex 7000',
    department: 'Finance',
    alertType: 'Suspicious Outbound Traffic — 2.3 GB to Unknown Host',
    category: 'Security',
    confidenceLevel: 'LOW',
    confidenceScore: 48,
    confidenceDriver: 'Traffic volume is anomalous but destination cannot be definitively classified as malicious.',
    reasoningSteps: [
      '📡 2.3 GB outbound data transfer to IP 185.220.101.x in the last 4 hours',
      '🌐 IP resolves to a Tor exit node — frequently used in data exfiltration scenarios',
      '🤔 However, this device runs a legitimate anonymisation tool for legal research (documented)',
      '📉 Confidence is limited because the AI cannot inspect encrypted packet contents',
    ],
    timelineEvents: [
      {
        time: "4 hours ago",
        event: "2.3 GB outbound traffic detected"
      },
      {
        time: "3 hours ago",
        event: "Destination resolved to Tor exit node"
      },
      {
        time: "2 hours ago",
        event: "Legitimate anonymisation tool identified"
      },
      {
        time: "Today",
        event: "Human analyst review recommended"
      }
    ],
    dataSource: 'Network flow telemetry from firewall logs over 24 hours + threat intelligence feed (updated 6 hrs ago)',
    limitations: 'AI cannot inspect encrypted traffic payloads — traffic destination is suspicious but not confirmed malicious. Tor exit nodes serve both legitimate and malicious traffic. Blocking may disrupt legitimate legal research workflows.',
    recommendedAction: 'Flag for Security Analyst review before taking automated action — do not block without investigation',
    status: 'PENDING',
    timestamp: '2026-03-15T10:22:00Z',
    severity: 'HIGH',
    estimatedImpact: 'Unknown — potential data exfiltration or legitimate activity',
    counterfactual: 'If the outbound traffic volume was under 500 MB, confidence would drop below the alert threshold.',
  },
  {
    id: 'ALT008',
    deviceName: 'DELL-LT-5521',
    deviceModel: 'Dell Latitude 9430',
    department: 'Executive',
    alertType: 'Firmware Update Available — BIOS 1.19.0 (Security Fix)',
    category: 'Security',
    confidenceLevel: 'MEDIUM',
    confidenceScore: 82,
    confidenceDriver: 'Update addresses 2 CVEs but executive devices have non-standard BIOS configurations.',
    reasoningSteps: [
      '🛡️ BIOS 1.19.0 patches CVE-2026-22476 (privilege escalation) and CVE-2026-22480 (TPM bypass)',
      '🏢 Executive devices have custom BIOS settings (PTT enabled, custom boot order) that may need re-verification post-update',
      '⚡ 127 standard fleet devices successfully updated to 1.19.0 with no issues reported',
      '📋 Update requires a full system reboot — scheduling during business hours is not recommended',
    ],
    timelineEvents: [
      {
        time: "Recent advisory",
        event: "Dell released BIOS 1.19.0"
      },
      {
        time: "This month",
        event: "127 standard devices updated successfully"
      },
      {
        time: "Today",
        event: "Executive device assessed"
      },
      {
        time: "Today",
        event: "Maintenance window update recommended"
      }
    ],
    dataSource: 'Firmware telemetry from 127 updated devices + Dell SupportAssist advisory database',
    limitations: 'Executive-class device BIOS configurations are not represented in the 127-device test sample. Custom TPM configuration may behave differently post-update. No rollback path exists for BIOS updates.',
    recommendedAction: 'Schedule BIOS update during next maintenance window; verify executive BIOS settings pre/post update',
    status: 'PENDING',
    timestamp: '2026-03-15T11:30:00Z',
    severity: 'MEDIUM',
    estimatedImpact: 'Low risk — standard security hardening',
    counterfactual: 'If this were a standard fleet device rather than an Executive profile, confidence would increase to HIGH.',
  },
  {
    id: 'ALT009',
    deviceName: 'DELL-WS-3390',
    deviceModel: 'Dell OptiPlex 3090',
    department: 'Marketing',
    alertType: 'Disk Space Critical — C: Drive 96% Full',
    category: 'Performance',
    confidenceLevel: 'HIGH',
    confidenceScore: 93,
    confidenceDriver: 'Disk usage is a direct measurement; growth rate projection uses 30-day trend data.',
    reasoningSteps: [
      '💿 C: drive is 96% full (238 GB of 250 GB used) — below the 5 GB OS minimum free space',
      '📈 Growth rate of 1.2 GB/day means full capacity will be reached in ~2 days',
      '🗑️ Disk Cleanup analysis shows 34 GB of recoverable space (temp files, old Windows Update cache)',
      '☁️ User\'s OneDrive sync has been paused for 11 days — 18 GB of files pending upload',
    ],
    timelineEvents: [
      {
        time: "30 days ago",
        event: "Disk growth trend detected"
      },
      {
        time: "Today",
        event: "Drive reached 96% capacity"
      },
      {
        time: "Today",
        event: "34 GB recoverable space identified"
      },
      {
        time: "Today",
        event: "Cleanup recommendation generated"
      }
    ],
    dataSource: 'Direct disk telemetry + file system analysis + OneDrive sync status API over 30 days',
    limitations: 'Disk Cleanup estimate may vary if files are locked by running processes. Deleting temp files will not address the underlying growth trend. OneDrive upload requires network bandwidth that may affect other users.',
    recommendedAction: 'Run Disk Cleanup remotely (34 GB recoverable) and resume OneDrive sync immediately',
    status: 'APPROVED',
    timestamp: '2026-03-15T07:15:00Z',
    severity: 'HIGH',
    estimatedImpact: 'Medium — OS instability if drive reaches 100%',
    humanDecision: 'APPROVED',
    decisionBy: 'Alex Chen',
    decisionTime: '2026-03-15T07:28:00Z',
    outcome: 'Disk cleanup completed — 31 GB freed. OneDrive sync resumed.',
    counterfactual: 'If the user\'s OneDrive was completely synced and empty, the recoverable space calculation would drop confidence to LOW.',
  },
  {
    id: 'ALT010',
    deviceName: 'DELL-LT-6677',
    deviceModel: 'Dell Latitude 5540',
    department: 'Engineering',
    alertType: 'Driver Conflict — NVIDIA GPU Driver Crash Loop',
    category: 'Hardware',
    confidenceLevel: 'LOW',
    confidenceScore: 52,
    confidenceDriver: 'Crash loop confirmed but root cause is ambiguous — two plausible causes with similar likelihood.',
    reasoningSteps: [
      '⚠️ GPU driver (nvlddmkm.sys) has crashed 7 times in 48 hours — system auto-recovering each time',
      '🔍 Two likely causes: (1) Windows Update KB5031455 known incompatibility with NVIDIA 546.x drivers',
      '🔍 Or (2) thermal throttling from blocked vents causing driver timeout (CPU temp 94°C recorded)',
      '📊 Only 12 similar cases in fleet history — insufficient data to distinguish between causes confidently',
    ],
    timelineEvents: [
      {
        time: "48 hours ago",
        event: "First GPU crash detected"
      },
      {
        time: "24 hours ago",
        event: "Repeated crash loop observed"
      },
      {
        time: "Today",
        event: "Two possible root causes identified"
      },
      {
        time: "Today",
        event: "Rollback recommendation generated"
      }
    ],
    dataSource: 'Event logs from 12 similar GPU crash incidents in fleet over 6 months + Microsoft known-issue database',
    limitations: 'AI cannot determine if the primary cause is the Windows Update conflict or thermal throttling without physical inspection. Rollback of KB5031455 may not resolve the issue if thermal is the root cause. Thermal inspection requires on-site visit.',
    recommendedAction: 'Try driver rollback to 537.13 first; if crashes persist, escalate for physical thermal inspection',
    status: 'PENDING',
    timestamp: '2026-03-15T08:55:00Z',
    severity: 'MEDIUM',
    estimatedImpact: 'Medium — productivity loss for engineering user',
    counterfactual: 'If CPU temperatures remained below 85°C during the crashes, the Windows Update conflict confidence would rise to HIGH.',
  },
];

export const activityLog = [
  {
    id: 'LOG001',
    timestamp: '2026-03-15T07:28:00Z',
    device: 'DELL-WS-3390',
    alertId: 'ALT009',
    aiAction: 'Recommended Disk Cleanup + OneDrive Resume',
    confidence: 'HIGH',
    humanDecision: 'APPROVED',
    decisionBy: 'Alex Chen',
    outcome: 'Success — 31 GB freed, OneDrive synced',
    category: 'Performance',
  },
  {
    id: 'LOG002',
    timestamp: '2026-03-14T16:35:00Z',
    device: 'DELL-WS-2291',
    alertId: 'ALT003',
    aiAction: 'Flagged SSD Replacement — 8% Life Remaining',
    confidence: 'HIGH',
    humanDecision: 'APPROVED',
    decisionBy: 'Alex Chen',
    outcome: 'In Progress — Replacement arriving in 2 days',
    category: 'Hardware',
  },
  {
    id: 'LOG003',
    timestamp: '2026-03-14T10:22:00Z',
    device: 'DELL-LT-3342',
    alertId: 'ALT006',
    aiAction: 'Recommended Re-enable BitLocker Immediately',
    confidence: 'HIGH',
    humanDecision: 'OVERRIDDEN',
    overrideReason: 'Authorized temporary decryption (CAB-2026-0312)',
    decisionBy: 'Alex Chen',
    outcome: 'Escalated to Security — monitoring active',
    category: 'Security',
  },
  {
    id: 'LOG004',
    timestamp: '2026-03-13T14:10:00Z',
    device: 'DELL-WS-9901',
    alertId: null,
    aiAction: 'Deployed Critical Patch KB5032189 (AUTO)',
    confidence: 'HIGH',
    humanDecision: 'AUTO-APPROVED',
    decisionBy: 'GuardianAI (Act on Low-Risk mode)',
    outcome: 'Success — 14 devices patched, 0 failures',
    category: 'Security',
    reasoningSteps: [
      '🛡️ CVE-2026-21412 rated CRITICAL by Microsoft — active exploitation reported in the wild',
      '📊 Patch KB5032189 tested on 89 fleet devices with identical OS config — 0 failures',
      '⏱️ Device was 11 days overdue for this patch — beyond the 7-day fleet standard',
      '✅ No custom software conflicts detected via automated pre-check scan',
    ],
    dataSource: 'Microsoft Security Response Center advisory + telemetry from 89 identical fleet devices over 14 days',
    limitations: 'Auto-approval bypasses human review. Pre-check scan does not cover custom kernel drivers. Rollback was not tested on this specific hardware revision.',
  },
  {
    id: 'LOG005',
    timestamp: '2026-03-13T09:45:00Z',
    device: 'DELL-LT-4412',
    alertId: null,
    aiAction: 'Recommended Security Scan — Malware Signature Detected',
    confidence: 'MEDIUM',
    humanDecision: 'ESCALATED',
    decisionBy: 'Alex Chen',
    outcome: 'Security team cleared — false positive (custom dev tool)',
    category: 'Security',
    reasoningSteps: [
      '🔍 Heuristic scan flagged binary signature matching known trojan variant Win32/AgentTesla',
      '📁 Flagged file located in C:\\Dev\\Tools\\netmon.exe — a non-standard path for system utilities',
      '🤔 Binary was unsigned and recently modified (last 48 hrs) — elevated suspicion score',
      '📊 3 of 5 similar flags in fleet history were confirmed true positives',
    ],
    dataSource: 'Endpoint detection telemetry from 2,400 devices + VirusTotal threat intelligence feed (updated 2 hrs ago)',
    limitations: 'Heuristic detection has a 15-20% false positive rate for developer tools. AI cannot distinguish between legitimate dev tools and obfuscated malware without sandbox execution. File was not submitted for cloud detonation.',
  },
  {
    id: 'LOG006',
    timestamp: '2026-03-12T22:15:00Z',
    device: 'DELL-WS-7742',
    alertId: null,
    aiAction: 'Auto-deployed NVIDIA GPU driver update 551.23 (AUTO)',
    confidence: 'HIGH',
    humanDecision: 'AUTO-APPROVED',
    decisionBy: 'GuardianAI (Act on Low-Risk mode)',
    outcome: 'FAILED — Device entered boot loop after driver install',
    category: 'Hardware',
    isIncident: true,
    reasoningSteps: [
      '🔄 NVIDIA driver 551.23 was flagged as a recommended update by Dell SupportAssist',
      '📊 127 fleet devices with similar GPU hardware updated successfully (0 failures)',
      '✅ Pre-deployment compatibility check passed — no conflicts detected',
      '⚠️ Post-install: Device failed to boot — nvlddmkm.sys crash on startup (BSOD 0x7E)',
    ],
    dataSource: 'Dell SupportAssist advisory database + driver telemetry from 127 similar fleet devices',
    limitations: 'Pre-deployment check did not detect a conflict between the new NVIDIA driver and a custom CUDA toolkit (v12.3) installed on this workstation. The 127-device test sample did not include any machines with CUDA toolkit installations.',
    incident: {
      severity: 'HIGH',
      rootCause: 'NVIDIA driver 551.23 conflicts with CUDA Toolkit v12.3 — the pre-deployment compatibility check does not scan for CUDA toolkit versions, only standard GPU driver dependencies.',
      telemetryGap: 'The 127-device validation sample contained zero machines with CUDA toolkit installed. This workstation was in the Engineering department and had a non-standard GPU compute configuration that was invisible to the fleet-level compatibility scanner.',
      impactMitigation: 'IT admin manually rolled back to NVIDIA driver 546.33 via Safe Mode recovery. Device restored to operational state within 45 minutes. No data loss confirmed.',
      preventiveAction: 'GuardianAI has added CUDA toolkit version to its pre-deployment compatibility checklist. Future GPU driver updates on CUDA-enabled devices will require explicit human approval regardless of autonomy mode setting.',
      timeToResolve: '45 minutes',
      affectedUsers: 1,
      dataLoss: false,
    },
  },
  {
    id: 'LOG007',
    timestamp: '2026-03-11T11:20:00Z',
    device: 'DELL-SRV-0102',
    alertId: null,
    aiAction: 'Auto-cleaned IIS Temp Logs Directory (AUTO)',
    confidence: 'HIGH',
    humanDecision: 'AUTO-APPROVED',
    decisionBy: 'GuardianAI (Act on Low-Risk mode)',
    outcome: 'FAILED — Production Site Offline (503 Service Unavailable)',
    category: 'Performance',
    isIncident: true,
    reasoningSteps: [
      '💿 C: drive on production server was at 98% capacity — disk exhaustion imminent',
      '🗑️ IIS Log folder identified as primary storage consumer (82 GB of log files)',
      '✅ Pre-cleanup check verified logs older than 14 days were compressed and archived',
      '⚠️ Post-cleanup: IIS service failed to restart due to active lockfile deletion in temp folder',
    ],
    dataSource: 'Server disk performance telemetry + IIS active site configuration database',
    limitations: 'Automatic directory cleanup scripts rely on timestamps and do not check for active file locks held by IIS worker processes (w3wp.exe) if the process is unresponsive.',
    incident: {
      severity: 'CRITICAL',
      rootCause: 'The automated cleanup script deleted an active lock file in the IIS temp directory because the worker process was temporarily hung and did not register the lock in the OS file table.',
      telemetryGap: 'Disk utilization agent does not monitor active IIS process handles or verify web server response codes (HTTP 200) post-cleanup.',
      impactMitigation: 'Web administrator restarted IIS services and manually recreated the system lock files. Service restored within 12 minutes.',
      preventiveAction: 'GuardianAI has updated the disk cleanup protocol to verify that IIS worker processes are stopped or idle before deleting any temp or lock files, and will perform an automated HTTP ping test post-execution to verify service health.',
      timeToResolve: '12 minutes',
      affectedUsers: 450,
      dataLoss: false,
    },
  },
];

export const autonomyLevels = [
  {
    id: 'always-ask',
    label: 'Always Ask Me',
    icon: '🙋',
    description: 'GuardianAI makes zero autonomous actions. Every recommendation waits for your explicit approval before anything happens. Full control, maximum oversight.',
    risk: 'Lowest AI autonomy',
    color: 'blue',
  },
  {
    id: 'recommend-wait',
    label: 'Recommend & Wait',
    icon: '📋',
    description: 'GuardianAI surfaces recommendations and queues actions, but takes no action until you review. You get a consolidated view of pending items each morning.',
    risk: 'Low AI autonomy',
    color: 'blue',
  },
  {
    id: 'act-low-risk',
    label: 'Act on Low-Risk',
    icon: '⚡',
    description: 'GuardianAI automatically applies patches rated LOW-RISK (< 5% fleet impact) and cleans disk space. HIGH confidence security alerts still require your approval.',
    risk: 'Moderate AI autonomy',
    color: 'amber',
  },
  {
    id: 'act-notify',
    label: 'Act and Notify',
    icon: '🤖',
    description: 'GuardianAI acts on all HIGH-confidence recommendations autonomously and notifies you after. You review the Activity Log, not the queue. Security incidents always escalate.',
    risk: 'Highest AI autonomy',
    color: 'red',
  },
];
