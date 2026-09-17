import { TriageCase, AuditLog } from '../types';

export const INITIAL_CASES: TriageCase[] = [
  {
    id: '77042901',
    sNo: 1,
    caseNumber: '77042901',
    title: 'Delay Local Banks ATM Claim ARB',
    departmentName: 'AlRajhiBankUAT',
    createdOn: '2026-08-27 05:07:39',
    owner: 'Ahmed',
    action: 'Open',
    problemCode: 'CD10326',
    slaHours: 24,
    slaMinutesLeft: 45,
    slaFormatted: 'SLA: 45m left',
    responsibleAgent: 'Rola',
    samaRef: 'C2608088001',
    customerQuery: 'On 26 June 2026, I tried to withdraw SAR 3200 from Al Rajhi ATM. The ATM showed transaction processing but did not dispense cash. However SAR 3200 was deducted from my account balance. My ATM card was also captured by the machine. I filed complaint with Al Rajhi Bank immediately but after more than 2 months my money is not refunded. Please help to refund my SAR 3200 to my account urgently. Thank you.',
    origin: 'SAMA level 1',
    agentResolution: 'اعتذار\nعزيزي العميل ، إشارة إلى الشكوى المقدمة من قبلكم والمتضمنه إعتراضكم على مطالبة مالية\nنود الإفادة ،\nلديكم مطالبة مالية برقم 20260816610142تم رفضها من البنك المقابل ( السعودي البريطاني ) للاعتراض يتم توجيه الشكوى للبنك الرافض للمطالبة\nوتم إشعاركم وافادتكم بالنتيجه أعلاه26-8-2026\nولمزيد من المعلومات والاستفسارات الرجاء الاتصال على الرقم المجاني الخاص بالمصرف 8001244455  وشكراً',

    // LLM internal context (NOT shown in UI)
    issueStatus: 'Language Mismatch; Topic Mismatch',
    reviewerComments: 'أولاً، هناك عدم تطابق في اللغة حيث كانت شكوى العميل باللغة الإنجليزية بينما رد الموظف باللغة العربية. ثانياً، هناك عدم تطابق في الموضوع؛ العميل يشتكي من عملية سحب نقدي فاشلة من صراف آلي لبنك الراجحي (ATM) واحتجاز البطاقة، بينما رد الموظف يتحدث عن "مطالبة مالية" تم رفضها من قبل بنك آخر (البنك السعودي البريطاني)، وهو ما لا يتناسب مع سياق المشكلة المذكورة.',
    correctnessScore: 15,
    correctnessAnalysis: 'The agent response has severe mismatches: the inquiry is in English while the response is in Arabic, and the agent referenced an unrelated SAB financial claim rather than addressing the failed Al Rajhi ATM cash withdrawal of SAR 3,200 and the captured card.',

    // Operational UI presentation fields
    status: 'in_review',
    category: 'card_ops',
    timeAgo: '15m ago',
    customerName: 'Mr. David Miller',
    customerTier: 'SAMA Escalation #ATM-77042901',
    accountNumber: '****3200',
    priority: 'P1',
    amount: 'SAR 3,200 ATM deduction',
    inboundChannel: 'SAMA Level 1 Dispute Portal',
    clientUuid: 'sau-raj-77042901-c1',
    timestamp: '2026-08-27 05:07:39',
    originalCustomerMessage: 'On 26 June 2026, I tried to withdraw SAR 3200 from Al Rajhi ATM. The ATM showed transaction processing but did not dispense cash. However SAR 3200 was deducted from my account balance. My ATM card was also captured by the machine. I filed complaint with Al Rajhi Bank immediately but after more than 2 months my money is not refunded. Please help to refund my SAR 3200 to my account urgently. Thank you.',
    suggestedResolution: `Dear Valued Customer,

Thank you for contacting Al Rajhi Bank Customer Care regarding your SAMA Level 1 dispute (Case Ref: #77042901 / SAMA Reference: C2608088001) concerning the failed cash withdrawal and captured debit card at our ATM on 26 June 2026.

We sincerely apologize for the delay and inconvenience experienced. Following an expedited reconciliation of the ATM cash cassette logs and electronic journal:

1. Immediate Refund of Deducted Amount: The un-dispensed cash amount of SAR 3,200 has been verified and credited back to your bank account with immediate value dating.
2. Replacement Card Issuance: A replacement ATM debit card has been issued with expedited priority and dispatched via courier to your registered national address at no charge.
3. Machine Audit: The ATM device logs have been inspected to prevent recurrence.

We deeply value your trust and patience. For immediate verification or further support, please contact our 24/7 dedicated helpline at 8001244455.

Sincerely,
Customer Care Operations & SAMA Level 1 Dispute Unit - Al Rajhi Bank`,
    policyProtocol: 'SAMA Banking Consumer Protection - ATM Dispute & Cash Reclamation Art. 12',
    policyTitle: 'SAMA_ATM_Cash_Dispute_Resolution_2026.pdf',
    complianceRate: '100% SAMA Compliant',
    latency: '165ms',
    actionsPerformed: [
      'Identified Language Mismatch: English customer query answered in Arabic',
      'Identified Topic Mismatch: Disconnected SAB bank claim versus Al Rajhi ATM cash failure',
      'Verified physical ATM cassette surplus logs for SAR 3,200 undispensed amount',
      'Dispatched SAR 3,200 core reversal credit to customer account',
      'Ordered replacement debit card with complimentary courier delivery',
    ],
    agentResolutionStatus: 'Logged in CRM',
    agentLoggedAt: '2026-08-26 05:07',
    crmTicketId: 'CRM-AR-77042901',
  },
  {
    id: '77042902',
    sNo: 2,
    caseNumber: '77042902',
    title: 'Delay Local Banks ATM Claim ARB',
    departmentName: 'AlRajhiBankUAT',
    createdOn: '2026-08-27 05:04:31',
    owner: 'Ahmed',
    action: 'Open',
    problemCode: 'CD10326',
    slaHours: 24,
    slaMinutesLeft: 120,
    slaFormatted: 'SLA: 2h left',
    responsibleAgent: 'Rola',
    samaRef: 'C2608088002',
    customerQuery: 'ذهبت إلى صراف الراجحي لسحب مبلغ 5 الف ريال وطلعت لي 2000 ريال فقط علما بأن بطاقتي من البنك الأهلي السعودي وتواصلت مع البنك الراجحي في نفس الوقت وأفاد مدير الفرع بأن الصراف الآلي فيه مشكلة فعلا وقال البلاغ عن طريق البنك الأهلي وثم تواصلت مع البنك الأهلي وتم رفع بلاغ وقالوا يتم رفع البلاغ عن طريق البنك الراجحي ويوجد الكاميرات الخاصة بالصراف  التي تثبت ذلك بتاريخ 1-8-2026 يوم السبت',
    origin: 'SAMA level 1',
    agentResolution: 'تنفيذ\nعزيزي العميل ، إشارة إلى الشكوى المقدمة من قبلكم والمتضمنه إعتراضكم على مطالبة مالية\nنود الإفادة ،\nتم قبول المطالبة : 20260803524871 واصدار امر الدفع للبنك المقابل كما هو مرفق لكم  ، يرجى التواصل مع البنك المصدر لبطاقتكم لاضافة المبلغ\nتم الاتصال بكم : 17:13 وتم الرد\nوتم إشعاركم بالنتيجه أعلاه26-8-2026\nولمزيد من المعلومات والاستفسارات الرجاء الاتصال على الرقم المجاني الخاص بالمصرف 8001244455  وشكراً',

    // LLM internal context (NOT shown in UI)
    issueStatus: 'Fulfilled Customer Query',
    reviewerComments: 'قام الموظف بمعالجة شكوى العميل بوضوح، حيث أفاد بقبول المطالبة المالية وإصدار أمر الدفع للبنك المقابل، ووجه العميل للتواصل مع البنك المصدر لإضافة المبلغ، كما أكد أنه تم التواصل مع العميل هاتفياً لإبلاغه بالنتيجة.',
    correctnessScore: 94,
    correctnessAnalysis: 'The agent response clearly and accurately addressed the customer inquiry: the financial claim was accepted, the payment order was issued to the cardholder’s bank (SNB), clear instructions were provided, and telephone follow-up was confirmed.',

    // Operational UI presentation fields
    status: 'queued',
    category: 'card_ops',
    timeAgo: '20m ago',
    customerName: 'عميل مصرف الراجحي / البنك الأهلي',
    customerTier: 'Local Interbank Client #SNB-5000',
    accountNumber: '****5000',
    priority: 'P2',
    amount: '3,000 ريال فارق سحب صراف',
    inboundChannel: 'SAMA Level 1 / شبكة مدى (Mada)',
    clientUuid: 'sau-raj-77042902-c2',
    timestamp: '2026-08-27 05:04:31',
    originalCustomerMessage: 'ذهبت إلى صراف الراجحي لسحب مبلغ 5 الف ريال وطلعت لي 2000 ريال فقط علما بأن بطاقتي من البنك الأهلي السعودي وتواصلت مع البنك الراجحي في نفس الوقت وأفاد مدير الفرع بأن الصراف الآلي فيه مشكلة فعلا وقال البلاغ عن طريق البنك الأهلي وثم تواصلت مع البنك الأهلي وتم رفع بلاغ وقالوا يتم رفع البلاغ عن طريق البنك الراجحي ويوجد الكاميرات الخاصة بالصراف  التي تثبت ذلك بتاريخ 1-8-2026 يوم السبت',
    suggestedResolution: `عميلنا العزيز، السلام عليكم ورحمة الله وبركاته،

إشارة إلى الشكوى المقدمة من قبلكم رقم 77042902 والمرجع الرقابي لدى البنك المركزي السعودي C2608088002 بخصوص عملية السحب المجتزأ من جهاز صراف مصرف الراجحي بتاريخ 1-8-2026 لبطاقة البنك الأهلي السعودي، حيث صُرف مبلغ 2,000 ريال من أصل 5,000 ريال:

نود الإفادة بأنه تم مطابقة سجلات الصراف الآلي وفحص كاميرات المراقبة وإجراء التسوية المصرفية المعتمدة:
1. تم قبول المطالبة المالية رسمياً تحت الرقم المرجعي: 20260803524871.
2. تم إصدار أمر الدفع والتسوية المباشرة لفارق المبلغ وقدره 3,000 ريال وإرساله رسمياً عبر الشبكة السعودية للمدفوعات (مدى) إلى البنك الأهلي السعودي (البنك المصدر لبطاقتكم).
3. يرجى التكرم بمتابعة حسابكم لدى البنك الأهلي السعودي لقيد المبلغ في رصيدكم.

نشكر تواصلكم، ولمزيد من المعلومات والاستفسارات يسرنا تواصلكم عبر الرقم المجاني 8001244455.

شاكرين ومقدرين حسن تعاونكم،
فريق العمليات المصرفية وتسوية مطالبات البنوك المحلية - مصرف الراجحي`,
    policyProtocol: 'Mada & Local Banks ATM Interbank Settlement Regulations Art. 14',
    policyTitle: 'SAMA_Mada_ATM_Claim_Settlement_2026.pdf',
    complianceRate: '100% SAMA Compliant',
    latency: '180ms',
    actionsPerformed: [
      'مطابقة سجلات الحركة النقدية في صراف الراجحي والتأكد من فائض 3,000 ريال',
      'إصدار أمر التسوية المالية للبنك الأهلي السعودي تحت مرجع 20260803524871',
      'التواصل الهاتفي الموثق مع العميل في الساعة 17:13 وتأكيد الإجراءات',
    ],
    agentResolutionStatus: 'Logged & Verified in CRM',
    agentLoggedAt: '2026-08-26 05:04',
    crmTicketId: 'CRM-AR-77042902',
  },
  {
    id: '77042903',
    sNo: 3,
    caseNumber: '77042903',
    title: 'Total Loss Settlment Delay',
    departmentName: 'Customer Care',
    createdOn: '2026-08-27 12:13:45',
    owner: 'Abdulrahman',
    action: 'Open',
    problemCode: 'CD000673',
    slaHours: 24,
    slaMinutesLeft: 180,
    slaFormatted: 'SLA: 3h left',
    responsibleAgent: 'Abdulmajeed',
    samaRef: 'C2608088003',
    customerQuery: 'البنك الى الان لم يقفل عقد التمويل علما بان السياره تالف كلينا من شهر ٢ ميلادي',
    origin: 'SAMA level 1',
    agentResolution: 'عزيزنا العميل، إشارة إلى الشكوى المقدمة من قبلكم والمتضمنة اعتراضكم (على التمويل التأجيري )  \n\nنود الافادة انه لا يوجد طلب قائم يخص الهلاك الكلي للعين , و يمكنكم انشاء طلب من خلال الفرع او الهاتف المصرفي .\nوقد تم اشعاركم في تاريخ 2026/8/26  \n\nولمزيد من المعلومات والاستفسارات الرجاء الاتصال على الرقم المجاني الخاص بالمصرف 8001244455',

    // LLM internal context (NOT shown in UI)
    issueStatus: 'Unnecessary Branch/Call Referral',
    reviewerComments: 'طلب العميل إغلاق عقد التمويل بسبب التلف الكلي للسيارة، وبدلاً من اتخاذ إجراء أو توجيهه للقنوات الرقمية المتاحة، قام الموظف بتوجيهه لزيارة الفرع أو الاتصال بالهاتف المصرفي لإنشاء طلب، وهو أمر يمكن معالجته أو البدء فيه مباشرة من قبل الموظف المسؤول عن الشكوى.',
    correctnessScore: 35,
    correctnessAnalysis: 'The customer requested termination of the vehicle finance lease due to total loss since February. Instead of initiating the settlement or processing it directly, the agent unnecessarily referred the customer to a physical branch or telephone banking, causing avoidable customer friction and delay contrary to SAMA operational guidelines.',

    // Operational UI presentation fields
    status: 'queued',
    category: 'car_leasing',
    timeAgo: '45m ago',
    customerName: 'عبد الرحمن بن خالد العتيبي',
    customerTier: 'Auto Lease Customer #AL-66103',
    accountNumber: '****1345',
    priority: 'P1',
    amount: 'إغلاق عقد تمويل تأجيري - هلاك كلي',
    inboundChannel: 'SAMA Level 1 / بوابة حماية العملاء',
    clientUuid: 'sau-raj-77042903-c3',
    timestamp: '2026-08-27 12:13:45',
    originalCustomerMessage: 'البنك الى الان لم يقفل عقد التمويل علما بان السياره تالف كلينا من شهر ٢ ميلادي',
    suggestedResolution: `عميلنا العزيز الأستاذ عبد الرحمن، السلام عليكم ورحمة الله وبركاته،

إشارة إلى الشكوى رقم 77042903 والمرجع الرقابي لدى البنك المركزي السعودي C2608088003 بشأن تأخر إغلاق عقد التمويل التأجيري للمركبة نظراً لتعرضها للهلاك الكلي منذ شهر فبراير الماضي:

نعتذر عما واجهتموه من تأخير ونفيدكم بأنه حرصاً على راحتكم وعدم إلزامكم بزيارة الفرع أو الاتصال بالهاتف المصرفي، فقد باشر فريق العمليات المركزية الإجراءات التالية فوراً:
1. تم تفعيل وقبول ملف الهلاك الكلي للمركبة مباشرة في النظام بناءً على تقرير نجم والتأمين المعتمد دون الحاجة لطلب جديد.
2. تم إيقاف احتساب أي أقساط تمويلية بأثر رجعي اعتباراً من تاريخ وقوع حادث الهلاك الكلي في شهر فبراير.
3. تم التنسيق مع شركة التأمين لتحصيل مبلغ التعويض، وإصدار أمر إغلاق العقد نهائياً وإسقاط الالتزامات الائتمانية وتحديث سجلكم لدى "سمة" خلال مدة أقصاها 5 أيام عمل.

في حال رغبتكم باستلام نسخة المخالصة عبر البريد الإلكتروني أو لأي استفسار، نرجو عدم التردد بالتواصل معنا عبر الرقم المجاني 8001244455.

مع خالص التحية والتقدير،
إدارة التمويل التأجيري ومتابعة قضايا ساما - مصرف الراجحي`,
    policyProtocol: 'SAMA Auto Lease Consumer Rights & Total Loss Settlement Standard Art. 19',
    policyTitle: 'SAMA_Auto_Lease_Total_Loss_Protocols_2026.pdf',
    complianceRate: '98% SAMA Compliant',
    latency: '195ms',
    actionsPerformed: [
      'استبعاد الإحالة غير الضرورية للفرع وتفعيل طلب الهلاك الكلي إلكترونياً',
      'إيقاف احتساب الأقساط التمويلية بأثر رجعي من تاريخ الحادث المعتمد',
      'إحالة ملف التعويض للتأمين لإنهاء مخالصة العقد وتحديث سمة',
    ],
    agentResolutionStatus: 'Closed by Agent',
    agentLoggedAt: '2026-08-26 12:13',
    crmTicketId: 'CRM-AR-77042903',
  },
  {
    id: '77042904',
    sNo: 4,
    caseNumber: '77042904',
    title: 'Delay Local Banks ATM Claim',
    departmentName: 'AlRajhiBankUAT',
    createdOn: '2026-08-26 05:08:08',
    owner: 'Thamer',
    action: 'Closed',
    problemCode: 'CD10329',
    slaHours: 24,
    slaMinutesLeft: 720,
    slaFormatted: 'SLA: 12h left',
    responsibleAgent: 'Rola',
    samaRef: 'C2608088004',
    customerQuery: 'انا عميل البنك العربي تم سحب مبلغ 5000 ريال من صرافة البنك الراجحي بتاريخ 30 / 7 / 2026 ما بين الساعة السادسة صباحا الي السابعة صباحا بمبلغ المذكور اعلاء وطلع معي مبلغ 4500 ريال فقط وتم سحب مبلغ 500 ريال هذبت الي البنك العربي وحدثتهم عن ذلك وتم رفع مطالبتين بذلك برقم 530341 و 554771 وجاء بالرفض من البنك الراجحي برقم 20260809572431 لذا ارجوا من سعادتكم التكرم باجراء اللازم وارجاع المبلغ علما بان مكان الصراف الراجحي في محافظة رجال المع ورقم الصراف الراجي هو 078002A2',
    origin: 'SAMA level 1',
    agentResolution: 'تنفيذ\nعزيزي العميل ، إشارة إلى الشكوى المقدمة من قبلكم والمتضمنه إعتراضكم على مطالبة مالية\nنود الإفادة ،\nتم قبول المطالبة وسيتم الايداع خلال 72 ساعة عمل\nوتم إشعاركم وافادتكم بالنتيجه أعلاه25-8-2026\nولمزيد من المعلومات والاستفسارات الرجاء الاتصال على الرقم المجاني الخاص بالمصرف 8001244455  وشكراً',

    // LLM internal context (NOT shown in UI)
    issueStatus: 'Fulfilled Customer Query',
    reviewerComments: 'قام الموظف بالرد على شكوى العميل بوضوح وأفاده بقبول المطالبة المالية وتحديد موعد الإيداع، مما يحل المشكلة الأساسية التي طرحها العميل.',
    correctnessScore: 96,
    correctnessAnalysis: 'The agent response clearly answered the customer complaint, reversed the prior dispute rejection, accepted the financial claim for the SAR 500 ATM discrepancy at the Rijal Almaa ATM (078002A2), and established a 72-business-hour deposit SLA.',

    // Operational UI presentation fields
    status: 'queued',
    category: 'card_ops',
    timeAgo: '1d ago',
    customerName: 'عميل البنك العربي الوطني',
    customerTier: 'Arab National Bank Interbank #ANB-530341',
    accountNumber: '****4500',
    priority: 'P2',
    amount: '500 ريال فارق سحب نقدي',
    inboundChannel: 'SAMA Level 1 / صراف رجال ألمع (078002A2)',
    clientUuid: 'sau-raj-77042904-c4',
    timestamp: '2026-08-26 05:08:08',
    originalCustomerMessage: 'انا عميل البنك العربي تم سحب مبلغ 5000 ريال من صرافة البنك الراجحي بتاريخ 30 / 7 / 2026 ما بين الساعة السادسة صباحا الي السابعة صباحا بمبلغ المذكور اعلاء وطلع معي مبلغ 4500 ريال فقط وتم سحب مبلغ 500 ريال هذبت الي البنك العربي وحدثتهم عن ذلك وتم رفع مطالبتين بذلك برقم 530341 و 554771 وجاء بالرفض من البنك الراجحي برقم 20260809572431 لذا ارجوا من سعادتكم التكرم باجراء اللازم وارجاع المبلغ علما بان مكان الصراف الراجحي في محافظة رجال المع ورقم الصراف الراجي هو 078002A2',
    suggestedResolution: `عميلنا العزيز، السلام عليكم ورحمة الله وبركاته،

إشارة إلى الشكوى رقم 77042904 والمرجع الرقابي لدى البنك المركزي السعودي C2608088004 بشأن فارق عملية السحب النقدي من جهاز صراف مصرف الراجحي بمحافظة رجال ألمع (رقم الجهاز: 078002A2) لبطاقة البنك العربي الوطني بمبلغ 500 ريال:

نفيدكم بأنه بناءً على إعادة مراجعة تدقيق العمليات النقدية وسجلات التسوية الإلكترونية:
1. تم قبول المطالبة وعكس قرار الرفض السابق تحت المرجع المالي: 20260809572431.
2. تم إصدار أمر تسوية مالية بمبلغ الفارق وقدره 500 ريال وإرساله عبر الشبكة السعودية للمدفوعات إلى حسابكم لدى البنك العربي الوطني.
3. سيتم إيداع المبلغ بحسابكم خلال مدة أقصاها 72 ساعة عمل.

شاكرين تواصلكم، ولمزيد من المعلومات والاستفسارات يرجى الاتصال على الرقم المجاني 8001244455.

وتقبلوا فائق التحية والتقدير،
إدارة العمليات المصرفية ومطالبات البنوك المحلية - مصرف الراجحي`,
    policyProtocol: 'SAMA Interbank ATM Dispute Standard & Timeframes Art. 8',
    policyTitle: 'SAMA_ATM_Interbank_Dispute_Standards_2026.pdf',
    complianceRate: '100% SAMA Compliant',
    latency: '150ms',
    actionsPerformed: [
      'إعادة فتح ملف المطالبة 20260809572431 وإلغاء الرفض السابق',
      'التحقق من سجلات جهاز صراف رجال ألمع 078002A2 وتأكيد عجز الصرف 500 ريال',
      'إصدار أمر الإيداع لحساب البنك العربي الوطني خلال مهلة 72 ساعة عمل',
    ],
    agentResolutionStatus: 'Logged & Verified in CRM',
    agentLoggedAt: '2026-08-25 05:08',
    crmTicketId: 'CRM-AR-77042904',
  },
  {
    id: '77042905',
    sNo: 5,
    caseNumber: '77042905',
    title: 'Delay Block Account',
    departmentName: 'AlRajhiBankUAT',
    createdOn: '8/26/26 14:41',
    owner: 'Bandar',
    action: 'Closed',
    problemCode: 'CD10377',
    slaHours: 24,
    slaMinutesLeft: 30,
    slaFormatted: 'SLA: 30m left (High Priority)',
    responsibleAgent: 'Abdulaziz',
    samaRef: 'C2608088005',
    customerQuery: 'السلام عليكم ورحمة الله وبركاته  \nأُقدم لكم بهذه الشكوى والتي تفيد بقيام بنك الراجحي الحجز على مبلغ مالي وقدره (1300)أودع في حسابي رقم الايبان(SA34 8000 0224 6080 1600 3600 )\nوهذا المبلغ مخصص لنفقة الشرعية للمعيشة أبنائي بموجب حكم قضائي قدر صدر صك النفقة المرفق لكم علماً بأن نظام البنك المركزي يمنع الحجز على أموال النفقة لصالح الديون أو المخالفات المرورية وقد تم الايداع بتاريخ(  26/8/19  )وقيمة المبلغ 1300\nنأمل منكم توجيه من يلزم برفع الحجز عن هذا المبلغ ليتسنى لنا سحبه لحاجة الاسرة لمبلغ النفقة .  \n\nحوالة داخلية\nمبلغ:SR 1300\nالى:3600\nمن:تنفيذ قضائى: 403014300030331\n26/8/19 12:14',
    origin: 'SAMA level 1',
    agentResolution: 'عزيزي العميل\nاشارة الى الشكوى المقدمة من قبلكم و المتضمنة اعتراضكم يتطلب اثبات من الجهه المودعه لإتاحة النسبة النظامية موضح به سبب ايداع المبلغ  \nتم إشعاركم بالنتيجه  أعلاه\nولمزيد من المعلومات والاستفسارات الرجاء الاتصال على الرقم المجاني الخاص بالمصرف 8001244455  وشكراً',

    // LLM internal context (NOT shown in UI)
    issueStatus: 'Incorrect Information',
    reviewerComments: 'لقد قدم العميل بالفعل إثباتاً (صك النفقة المرفق) ووضح سبب الإيداع (نفقة شرعية)، إلا أن الموظف رد بأن الأمر يتطلب إثباتاً من الجهة المودعة موضحاً به سبب الإيداع، وهو ما يتناقض مع المعلومات المتوفرة في طلب العميل.',
    correctnessScore: 20,
    correctnessAnalysis: 'The agent provided incorrect information and unnecessary requirements: the customer had already provided official judicial proof (صك النفقة) and the deposit reference (تنفيذ قضائي 403014300030331) for child support. SAMA regulations strictly forbid freezing, seizing, or deducting child support funds for debts or traffic fines.',

    // Operational UI presentation fields
    status: 'locked',
    category: 'urgent',
    timeAgo: '1d ago',
    customerName: 'بندر بن عبد الله السبيعي',
    customerTier: 'SAMA Priority Protection #SA34-3600',
    accountNumber: 'SA34 8000 0224 6080 1600 3600',
    priority: 'P1',
    amount: '1,300 ريال نفقة شرعية محمية',
    inboundChannel: 'SAMA Level 1 / تنفيذ قضائي',
    clientUuid: 'sau-raj-77042905-c5',
    timestamp: '8/26/26 14:41',
    originalCustomerMessage: 'السلام عليكم ورحمة الله وبركاته  \nأُقدم لكم بهذه الشكوى والتي تفيد بقيام بنك الراجحي الحجز على مبلغ مالي وقدره (1300)أودع في حسابي رقم الايبان(SA34 8000 0224 6080 1600 3600 )\nوهذا المبلغ مخصص لنفقة الشرعية للمعيشة أبنائي بموجب حكم قضائي قدر صدر صك النفقة المرفق لكم علماً بأن نظام البنك المركزي يمنع الحجز على أموال النفقة لصالح الديون أو المخالفات المرورية وقد تم الايداع بتاريخ(  26/8/19  )وقيمة المبلغ 1300\nنأمل منكم توجيه من يلزم برفع الحجز عن هذا المبلغ ليتسنى لنا سحبه لحاجة الاسرة لمبلغ النفقة .  \n\nحوالة داخلية\nمبلغ:SR 1300\nالى:3600\nمن:تنفيذ قضائى: 403014300030331\n26/8/19 12:14',
    suggestedResolution: `عميلنا العزيز الأستاذ بندر، السلام عليكم ورحمة الله وبركاته،

إشارة إلى شكواكم رقم 77042905 والمرجع الرقابي لدى البنك المركزي السعودي C2608088005 بخصوص الحجز على مبلغ 1,300 ريال المودع بالحوالة الداخلية رقم 403014300030331 في حسابكم الآيبان (SA34 8000 0224 6080 1600 3600):

نعتذر بشدة عن الإفادة السابقة، ونود التأكيد على أنه استناداً إلى صك النفقة الشرعية الصادر بحكم قضائي والمرفق بطلبكم، وتنفيذاً للضوابط والتعليمات الصارمة الصادرة من البنك المركزي السعودي (ساما) والتي تحظر قطعياً الحجز أو الاستقطاع من أموال النفقة الشرعية المخصصة لإعالة الأبناء لصالح أي ديون أو مخالفات:
1. تم فورياً رفع الحجز الإلكتروني عن كامل مبلغ النفقة البالغ 1,300 ريال.
2. المبلغ متاح الآن في حسابكم الجاري للسحب النقدي الفوري أو استخدام بطاقة مدى دون أي قيود.
3. تم وضع رمز الحماية النظامية المخصص لأموال النفقة على حسابكم لضمان عدم تعرض الحوالات الواردة بالنفقة لأي حجز آلي مستقبلاً.

شاكرين تواصلكم ومقدرين كريم صبركم،
إدارة حماية العملاء والالتزام الرقابي - مصرف الراجحي`,
    policyProtocol: 'SAMA Circular on Protection of Judicial Child Support Funds No. 44100',
    policyTitle: 'SAMA_Judicial_Child_Support_Protection_2026.pdf',
    complianceRate: '100% SAMA Compliant',
    latency: '140ms',
    actionsPerformed: [
      'تصحيح الخطأ الإجرائي واستبعاد طلب إثبات جديد نظراً لوجود صك النفقة المرفق',
      'تطبيق تعميم البنك المركزي السعودي رقم 44100 بحظر الحجز على أموال النفقة الشرعية',
      'رفع الحجز الإلكتروني الفوري عن مبلغ 1,300 ريال وإتاحته بالكامل للسحب',
      'تثبيت وسم الحماية الرقابية لأموال النفقة على الحساب الآيبان SA34 8000 0224 6080 1600 3600',
    ],
    agentResolutionStatus: 'Logged in CRM',
    agentLoggedAt: '8/26/26 14:41',
    crmTicketId: 'CRM-AR-77042905',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    timestamp: '2026-08-27 05:07 UTC',
    actor: 'SAMA Gateway',
    action: 'Dispute Level 1 Received',
    details: 'Inbound SAMA Case #77042901 (Delay Local Banks ATM Claim ARB - SAR 3,200) routed to AlRajhiBankUAT.',
  },
  {
    timestamp: '2026-08-27 05:04 UTC',
    actor: 'Rola (Responsible Agent)',
    action: 'Payment Order Issued',
    details: 'Case #77042902 payment order 20260803524871 issued to SNB for SAR 3,000 ATM discrepancy.',
  },
  {
    timestamp: '2026-08-27 12:13 UTC',
    actor: 'Abdulmajeed (Responsible Agent)',
    action: 'CRM Referral Logged',
    details: 'Case #77042903 referral note recorded for total loss vehicle finance contract CD000673.',
  },
  {
    timestamp: '2026-08-26 05:08 UTC',
    actor: 'Rola (Responsible Agent)',
    action: 'Dispute Accepted in CRM',
    details: 'Case #77042904 claim accepted for SAR 500 Rijal Almaa ATM difference with 72h SLA.',
  },
  {
    timestamp: '2026-08-26 14:41 UTC',
    actor: 'Abdulaziz (Responsible Agent)',
    action: 'Account Hold Inquiry',
    details: 'Case #77042905 review of child support hold SAR 1,300 for account ending in 3600.',
  },
];
