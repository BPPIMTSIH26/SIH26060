import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65, 
        paddingHorizontal: 35,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        position: 'relative',
    },
    
    // --- Watermark & Seal ---
    watermarkWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    watermarkImage: {
        width: 220, // Scaled down slightly to balance with the text
        opacity: 0.08,
    },
    watermarkTitle: {
        marginTop: 25,
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
        opacity: 0.06,
        letterSpacing: 4,
        textAlign: 'center',
    },
    watermarkSubtitle: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
        opacity: 0.06,
        letterSpacing: 8,
        textAlign: 'center',
    },

    // --- Header ---
    headerContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#1e293b',
        paddingBottom: 15,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerRight: {
        textAlign: 'right',
    },
    scoreText: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginTop: 2,
    },

    // --- Sections ---
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        color: '#0f172a',
        backgroundColor: '#f1f5f9',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 10,
    },
    
    // --- Lists ---
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingLeft: 10,
        paddingRight: 20,
    },
    bulletPoint: {
        width: 15,
        fontSize: 10,
        color: '#334155',
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.4,
    },

    // --- Tables ---
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#e2e8f0',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeaderBase: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e2e8f0',
        backgroundColor: '#f8fafc',
    },
    tableColBase: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e2e8f0',
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#475569',
    },
    tableCell: {
        margin: 5,
        fontSize: 9,
        color: '#334155',
    },
    tableCellBold: {
        margin: 5,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
    },

    // --- Footer ---
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 35,
        right: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#cbd5e1',
        paddingTop: 8,
    },
    footerText: {
        fontSize: 8,
        color: '#64748b',
        fontFamily: 'Courier',
    },
    footerPage: {
        fontSize: 8,
        color: '#64748b',
        fontFamily: 'Helvetica-Bold',
    }
});

const getStatusColor = (status) => {
    if (status === "GREEN") return '#10b981';
    if (status === "YELLOW") return '#f59e0b';
    return '#ef4444';
};

// ==========================================
// CATEGORY-SPECIFIC TABLE COMPONENTS
// ==========================================
const OverallTable = ({ reportData }) => {
    const { energy_analysis, environment_analysis, logistics_analysis } = reportData;
    const col33 = { width: '33.33%' };
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeaderBase, col33]}><Text style={styles.tableCellHeader}>Energy Grid</Text></View>
                <View style={[styles.tableColHeaderBase, col33]}><Text style={styles.tableCellHeader}>Environment</Text></View>
                <View style={[styles.tableColHeaderBase, col33]}><Text style={styles.tableCellHeader}>Logistics</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Gen: {energy_analysis?.metrics?.average_generation_kw || 0} kW</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Exterior: {environment_analysis?.metrics?.outside_temp_c || 0}°C</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Food: {logistics_analysis?.supplies?.food?.current_stock_days || 0} Days</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Load: {energy_analysis?.metrics?.average_load_kw || 0} kW</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Wind: {environment_analysis?.metrics?.wind_speed_kmh || 0} km/h</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Medical: {logistics_analysis?.supplies?.medical?.current_stock_percent || 0}%</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCellBold}>Battery: {energy_analysis?.metrics?.battery_charge_percent || 0}%</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Blizzard: {environment_analysis?.metrics?.blizzard_active ? "ACTIVE" : "Clear"}</Text></View>
                <View style={[styles.tableColBase, col33]}><Text style={styles.tableCell}>Fuel Tank: {energy_analysis?.fuel_status?.fuel_level_percent || 0}%</Text></View>
            </View>
        </View>
    );
};

const EnergyTable = ({ reportData }) => {
    const { energy_analysis } = reportData;
    const col50 = { width: '50%' };
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Power Generation & Load</Text></View>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Reserves & Storage</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Average Generation: {energy_analysis?.metrics?.average_generation_kw || 0} kW</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Battery Charge: {energy_analysis?.metrics?.battery_charge_percent || 0}%</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Average Load: {energy_analysis?.metrics?.average_load_kw || 0} kW</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Backup Hours: {energy_analysis?.metrics?.backup_hours_remaining || 0} hrs</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}>
                    <Text style={[styles.tableCellBold, { color: (energy_analysis?.metrics?.net_deficit_kw || 0) < 0 ? '#ef4444' : '#10b981' }]}>
                        Net Deficit: {energy_analysis?.metrics?.net_deficit_kw || 0} kW
                    </Text>
                </View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Primary Fuel Level: {energy_analysis?.fuel_status?.fuel_level_percent || 0}%</Text></View>
            </View>
        </View>
    );
};

const EnvironmentTable = ({ reportData }) => {
    const { environment_analysis } = reportData;
    const col50 = { width: '50%' };
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Atmospheric Conditions</Text></View>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Visibility & Phenomena</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Outside Temperature: {environment_analysis?.metrics?.outside_temp_c || 0}°C</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Visibility: {environment_analysis?.metrics?.visibility_meters || 0} meters</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Wind Speed: {environment_analysis?.metrics?.wind_speed_kmh || 0} km/h</Text></View>
                <View style={[styles.tableColBase, col50]}>
                    <Text style={[styles.tableCellBold, { color: environment_analysis?.metrics?.blizzard_active ? '#ef4444' : '#10b981' }]}>
                        Blizzard State: {environment_analysis?.metrics?.blizzard_active ? "ACTIVE" : "CLEAR"}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const LogisticsTable = ({ reportData }) => {
    const { logistics_analysis } = reportData;
    const col50 = { width: '50%' };
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Consumable Supplies</Text></View>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Personnel & Reserves</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Food Stock: {logistics_analysis?.supplies?.food?.current_stock_days || 0} Days Remaining</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Personnel on Station: {logistics_analysis?.personnel?.on_station || 0} Pax</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Medical Supplies: {logistics_analysis?.supplies?.medical?.current_stock_percent || 0}% Level</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Emergency Fuel: {logistics_analysis?.supplies?.fuel_emergency_reserve?.current_liters || 0} L</Text></View>
            </View>
        </View>
    );
};

const InfrastructureTable = ({ reportData }) => {
    const { infrastructure_analysis, system_health_breakdown } = reportData;
    const col50 = { width: '50%' };
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Module Diagnostics</Text></View>
                <View style={[styles.tableColHeaderBase, col50]}><Text style={styles.tableCellHeader}>Internal Climate</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Structural Integrity: {system_health_breakdown?.infrastructure_score || 0}%</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Main Lab Temp: {infrastructure_analysis?.modules?.main_lab?.average_temperature_c || 0}°C</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}>
                    <Text style={[styles.tableCellBold, { color: system_health_breakdown?.infrastructure_status === "GREEN" ? '#10b981' : '#f59e0b' }]}>
                        Status: {system_health_breakdown?.infrastructure_status || "NOMINAL"}
                    </Text>
                </View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Quarters Temp: {infrastructure_analysis?.modules?.living_quarters?.average_temperature_c || 0}°C</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>HVAC System: {infrastructure_analysis?.hvac_system?.status?.toUpperCase() || 'NOMINAL'}</Text></View>
                <View style={[styles.tableColBase, col50]}><Text style={styles.tableCell}>Storage Temp: {infrastructure_analysis?.modules?.storage?.average_temperature_c || 0}°C</Text></View>
            </View>
        </View>
    );
};


// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ReportPDF({ reportData, reportType, reportCategory = 'overall', activeStation, user }) {
    if (!reportData) return null;

    const { executive_summary, alerts_log } = reportData;
    
    const now = new Date();
    const istTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
    const stnTime = new Date(now.getTime() + (3.5 * 3600000)).toISOString().substring(11, 19);

    const filterByScope = (items) => {
        if (reportCategory === 'overall') return items;
        return items.filter(item => {
            const str = item.toLowerCase();
            if (reportCategory === 'energy') return str.includes('power') || str.includes('gen') || str.includes('fuel') || str.includes('grid');
            if (reportCategory === 'environment') return str.includes('temp') || str.includes('wind') || str.includes('weather');
            if (reportCategory === 'logistics') return str.includes('shipment') || str.includes('stock') || str.includes('supply');
            if (reportCategory === 'infrastructure') return str.includes('module') || str.includes('hvac') || str.includes('structural') || str.includes('infra');
            return true; 
        });
    };

    const targetHighlights = filterByScope(executive_summary?.key_highlights || []);
    const targetActions = filterByScope(executive_summary?.recommended_actions || []);
    
    const relevantAlerts = reportCategory === 'overall' 
        ? (alerts_log || [])
        : (alerts_log || []).filter(a => a.affected_system?.toLowerCase().includes(reportCategory));

    const logoUrl = `${window.location.origin}/image.png`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                {/* GLOBAL WATERMARK WITH TEXT SEAL */}
                <View style={styles.watermarkWrapper} fixed>
                    <Image src={logoUrl} style={styles.watermarkImage} />
                    <Text style={styles.watermarkTitle}>GOVT OF INDIA</Text>
                    <Text style={styles.watermarkSubtitle}>MINISTRY OF EARTH SCIENCES</Text>
                </View>

                {/* 1. DOCUMENT HEADER */}
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.title}>{activeStation} Operations</Text>
                        <Text style={styles.subtitle}>{reportType} {reportCategory !== 'overall' ? reportCategory : ''} REPORT • {now.toLocaleDateString()}</Text>
                        <Text style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, fontFamily: 'Courier' }}>ID: {reportData.report_id}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.scoreText}>Health: {executive_summary.overall_health_score}/100</Text>
                        <Text style={[styles.statusText, { color: getStatusColor(executive_summary.operational_status) }]}>
                            STATUS: {executive_summary.operational_status}
                        </Text>
                    </View>
                </View>

                {/* 2. EXECUTIVE INTELLIGENCE */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Executive Intelligence: {reportCategory.toUpperCase()}</Text>
                    
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 4, paddingLeft: 8 }}>Targeted Highlights:</Text>
                    {targetHighlights.length > 0 ? targetHighlights.map((highlight, idx) => (
                        <View key={`hl-${idx}`} style={styles.bulletRow}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{highlight}</Text>
                        </View>
                    )) : (
                        <Text style={{ fontSize: 10, color: '#64748b', paddingLeft: 10, marginBottom: 6, fontStyle: 'italic' }}>No specific highlights for {reportCategory}.</Text>
                    )}

                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#b45309', marginTop: 6, marginBottom: 4, paddingLeft: 8 }}>Required Actions:</Text>
                    {targetActions.length > 0 ? targetActions.map((action, idx) => (
                        <View key={`ra-${idx}`} style={styles.bulletRow}>
                            <Text style={[styles.bulletPoint, { color: '#b45309' }]}>!</Text>
                            <Text style={[styles.bulletText, { color: '#b45309' }]}>{action}</Text>
                        </View>
                    )) : (
                        <Text style={{ fontSize: 10, color: '#64748b', paddingLeft: 10, fontStyle: 'italic' }}>No specific actions required.</Text>
                    )}
                </View>

                {/* 3. CORE METRICS (DYNAMIC TABLE) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Telemetry & Resources</Text>
                    {reportCategory === 'overall' && <OverallTable reportData={reportData} />}
                    {reportCategory === 'energy' && <EnergyTable reportData={reportData} />}
                    {reportCategory === 'environment' && <EnvironmentTable reportData={reportData} />}
                    {reportCategory === 'logistics' && <LogisticsTable reportData={reportData} />}
                    {reportCategory === 'infrastructure' && <InfrastructureTable reportData={reportData} />}
                </View>

                {/* 4. ACTIVE ALERTS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Systems Alerts</Text>
                    {relevantAlerts.length > 0 ? (
                        relevantAlerts.map((alert, idx) => (
                            <View key={`al-${idx}`} style={styles.bulletRow}>
                                <Text style={[styles.bulletPoint, { color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b', fontFamily: 'Helvetica-Bold' }]}>
                                    {alert.severity === 'critical' ? '[!]' : '[-]'}
                                </Text>
                                <Text style={styles.bulletText}>
                                    {alert.affected_system.toUpperCase()}: {alert.message}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 10, color: '#64748b', paddingLeft: 10, fontStyle: 'italic' }}>
                            No active alerts recorded for {reportCategory} during this period.
                        </Text>
                    )}
                </View>

                {/* 5. MANDATORY FIXED FOOTER */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Auth: {user?.fullName || "Operator"} ({(user?.role || "operator").replace('_', ' ').toUpperCase()})
                    </Text>
                    <Text style={styles.footerText}>
                        IST: {istTime} | STN: {stnTime}
                    </Text>
                    <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => (
                        `PAGE ${pageNumber} OF ${totalPages}`
                    )} fixed />
                </View>

            </Page>
        </Document>
    );
}