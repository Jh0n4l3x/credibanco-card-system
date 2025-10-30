-- ===================================================================
-- 📊 CONSULTAS ÚTILES PARA CREDIBANCO CARD SYSTEM
-- ===================================================================
-- Archivo con consultas SQL para análisis y monitoreo del sistema
-- Última actualización: 30 de octubre de 2024
-- ===================================================================

-- -------------------------------------------------------------------
-- 🔍 CONSULTAS DE INFORMACIÓN GENERAL
-- -------------------------------------------------------------------

-- 1. Resumen general del sistema
SELECT 
    'TARJETAS ACTIVAS' as tipo,
    COUNT(*) as cantidad
FROM cards 
WHERE status = 'ENROLLED'
UNION ALL
SELECT 
    'TARJETAS CREADAS',
    COUNT(*)
FROM cards 
WHERE status = 'CREATED'
UNION ALL
SELECT 
    'TRANSACCIONES APROBADAS',
    COUNT(*)
FROM transactions 
WHERE status = 'APPROVED'
UNION ALL
SELECT 
    'TRANSACCIONES CANCELADAS',
    COUNT(*)
FROM transactions 
WHERE status = 'CANCELLED';

-- 2. Dashboard principal - Métricas clave
SELECT 
    (SELECT COUNT(*) FROM cards) as total_tarjetas,
    (SELECT COUNT(*) FROM cards WHERE status = 'ENROLLED') as tarjetas_activas,
    (SELECT COUNT(*) FROM transactions) as total_transacciones,
    (SELECT COUNT(*) FROM transactions WHERE status = 'APPROVED') as transacciones_aprobadas,
    (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE status = 'APPROVED') as monto_total_transacciones,
    (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = CURDATE()) as transacciones_hoy;

-- -------------------------------------------------------------------
-- 💳 CONSULTAS DE TARJETAS
-- -------------------------------------------------------------------

-- 3. Listado completo de tarjetas con información básica
SELECT 
    identifier as PAN,
    holder_name as titular,
    document_number as documento,
    card_type as tipo,
    status as estado,
    phone_number as telefono,
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as fecha_creacion
FROM cards
ORDER BY created_at DESC;

-- 4. Tarjetas por estado
SELECT 
    status as estado,
    card_type as tipo,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cards)), 2) as porcentaje
FROM cards
GROUP BY status, card_type
ORDER BY status, card_type;

-- 5. Tarjetas creadas por mes (últimos 6 meses)
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as mes,
    card_type as tipo,
    COUNT(*) as cantidad
FROM cards
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m'), card_type
ORDER BY mes DESC, card_type;

-- 6. Buscar tarjeta específica por documento
-- Reemplazar '12345678' con el número de documento a buscar
SELECT 
    identifier as PAN,
    holder_name as titular,
    document_number as documento,
    card_type as tipo,
    status as estado,
    phone_number as telefono,
    created_at as fecha_creacion
FROM cards
WHERE document_number = '12345678';

-- 7. Tarjetas sin transacciones
SELECT 
    c.identifier as PAN,
    c.holder_name as titular,
    c.status as estado,
    c.created_at as fecha_creacion
FROM cards c
LEFT JOIN transactions t ON c.identifier = t.card_identifier
WHERE t.card_identifier IS NULL
ORDER BY c.created_at DESC;

-- -------------------------------------------------------------------
-- 💰 CONSULTAS DE TRANSACCIONES
-- -------------------------------------------------------------------

-- 8. Resumen de transacciones por estado
SELECT 
    status as estado,
    COUNT(*) as cantidad,
    COALESCE(SUM(total_amount), 0) as monto_total,
    ROUND(AVG(total_amount), 2) as monto_promedio,
    MIN(total_amount) as monto_minimo,
    MAX(total_amount) as monto_maximo
FROM transactions
GROUP BY status
ORDER BY monto_total DESC;

-- 9. Transacciones del día actual
SELECT 
    t.reference_number as referencia,
    t.card_identifier as PAN,
    c.holder_name as titular,
    t.total_amount as monto,
    t.status as estado,
    TIME_FORMAT(t.created_at, '%H:%i:%s') as hora
FROM transactions t
INNER JOIN cards c ON t.card_identifier = c.identifier
WHERE DATE(t.created_at) = CURDATE()
ORDER BY t.created_at DESC;

-- 10. Top 10 transacciones por monto
SELECT 
    t.reference_number as referencia,
    t.card_identifier as PAN,
    c.holder_name as titular,
    t.total_amount as monto,
    t.purchase_address as comercio,
    t.status as estado,
    DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i') as fecha
FROM transactions t
INNER JOIN cards c ON t.card_identifier = c.identifier
WHERE t.status = 'APPROVED'
ORDER BY t.total_amount DESC
LIMIT 10;

-- 11. Actividad por tarjeta (con resumen de transacciones)
SELECT 
    c.identifier as PAN,
    c.holder_name as titular,
    c.status as estado_tarjeta,
    COUNT(t.id) as total_transacciones,
    COALESCE(SUM(CASE WHEN t.status = 'APPROVED' THEN t.total_amount ELSE 0 END), 0) as monto_aprobado,
    COALESCE(SUM(CASE WHEN t.status = 'CANCELLED' THEN t.total_amount ELSE 0 END), 0) as monto_cancelado,
    MAX(t.created_at) as ultima_transaccion
FROM cards c
LEFT JOIN transactions t ON c.identifier = t.card_identifier
GROUP BY c.identifier, c.holder_name, c.status
ORDER BY total_transacciones DESC, ultima_transaccion DESC;

-- 12. Transacciones por rango de fechas
-- Reemplazar las fechas según necesidad
SELECT 
    DATE(t.created_at) as fecha,
    COUNT(*) as cantidad,
    SUM(CASE WHEN t.status = 'APPROVED' THEN 1 ELSE 0 END) as aprobadas,
    SUM(CASE WHEN t.status = 'CANCELLED' THEN 1 ELSE 0 END) as canceladas,
    COALESCE(SUM(CASE WHEN t.status = 'APPROVED' THEN t.total_amount ELSE 0 END), 0) as monto_total
FROM transactions t
WHERE t.created_at BETWEEN '2024-10-01' AND '2024-10-31'
GROUP BY DATE(t.created_at)
ORDER BY fecha DESC;

-- -------------------------------------------------------------------
-- 📈 CONSULTAS DE ANÁLISIS Y REPORTES
-- -------------------------------------------------------------------

-- 13. Análisis por tipo de tarjeta
SELECT 
    c.card_type as tipo_tarjeta,
    COUNT(DISTINCT c.identifier) as total_tarjetas,
    COUNT(t.id) as total_transacciones,
    COALESCE(SUM(CASE WHEN t.status = 'APPROVED' THEN t.total_amount ELSE 0 END), 0) as volumen_aprobado,
    ROUND(AVG(CASE WHEN t.status = 'APPROVED' THEN t.total_amount END), 2) as ticket_promedio
FROM cards c
LEFT JOIN transactions t ON c.identifier = t.card_identifier
GROUP BY c.card_type
ORDER BY volumen_aprobado DESC;

-- 14. Tendencia semanal de transacciones
SELECT 
    YEARWEEK(created_at) as semana,
    DAYNAME(created_at) as dia_semana,
    COUNT(*) as transacciones,
    SUM(CASE WHEN status = 'APPROVED' THEN total_amount ELSE 0 END) as monto_total
FROM transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
GROUP BY YEARWEEK(created_at), DAYNAME(created_at), DAYOFWEEK(created_at)
ORDER BY semana DESC, DAYOFWEEK(created_at);

-- 15. Comercios con más transacciones
SELECT 
    purchase_address as comercio,
    COUNT(*) as transacciones,
    SUM(CASE WHEN status = 'APPROVED' THEN total_amount ELSE 0 END) as volumen_total,
    ROUND(AVG(CASE WHEN status = 'APPROVED' THEN total_amount END), 2) as ticket_promedio,
    MAX(created_at) as ultima_transaccion
FROM transactions
WHERE purchase_address IS NOT NULL AND purchase_address != ''
GROUP BY purchase_address
HAVING COUNT(*) >= 2
ORDER BY transacciones DESC, volumen_total DESC
LIMIT 15;

-- -------------------------------------------------------------------
-- 🔍 CONSULTAS DE MONITOREO Y AUDITORIA
-- -------------------------------------------------------------------

-- 16. Actividad reciente del sistema (últimas 24 horas)
SELECT 
    'TARJETA CREADA' as actividad,
    identifier as referencia,
    holder_name as detalle,
    created_at as fecha
FROM cards
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
UNION ALL
SELECT 
    'TRANSACCION PROCESADA' as actividad,
    reference_number as referencia,
    CONCAT(card_identifier, ' - $', total_amount) as detalle,
    created_at as fecha
FROM transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY fecha DESC
LIMIT 20;

-- 17. Detección de posibles anomalías
-- Transacciones de alto valor (mayor al percentil 95)
WITH high_value_threshold AS (
    SELECT 
        ROUND(
            (SELECT total_amount 
             FROM transactions 
             WHERE status = 'APPROVED' 
             ORDER BY total_amount 
             LIMIT 1 OFFSET (SELECT ROUND(0.95 * COUNT(*)) FROM transactions WHERE status = 'APPROVED')
            ), 2
        ) as threshold
)
SELECT 
    t.reference_number as referencia,
    t.card_identifier as PAN,
    c.holder_name as titular,
    t.total_amount as monto,
    hvt.threshold as limite_alertas,
    t.purchase_address as comercio,
    t.created_at as fecha
FROM transactions t
INNER JOIN cards c ON t.card_identifier = c.identifier
CROSS JOIN high_value_threshold hvt
WHERE t.status = 'APPROVED' 
  AND t.total_amount > hvt.threshold
ORDER BY t.total_amount DESC;

-- 18. Tarjetas con múltiples transacciones en corto tiempo
SELECT 
    card_identifier as PAN,
    COUNT(*) as transacciones_hora,
    MIN(created_at) as primera_transaccion,
    MAX(created_at) as ultima_transaccion,
    SUM(total_amount) as monto_total
FROM transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
  AND status = 'APPROVED'
GROUP BY card_identifier
HAVING COUNT(*) >= 3
ORDER BY transacciones_hora DESC;

-- -------------------------------------------------------------------
-- 📊 CONSULTAS PARA DASHBOARD EN TIEMPO REAL
-- -------------------------------------------------------------------

-- 19. Métricas para dashboard - Última hora
SELECT 
    'TRANSACCIONES_ULTIMA_HORA' as metrica,
    COUNT(*) as valor
FROM transactions 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
UNION ALL
SELECT 
    'MONTO_ULTIMA_HORA',
    COALESCE(SUM(total_amount), 0)
FROM transactions 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR) 
  AND status = 'APPROVED'
UNION ALL
SELECT 
    'TARJETAS_CREADAS_HOY',
    COUNT(*)
FROM cards 
WHERE DATE(created_at) = CURDATE()
UNION ALL
SELECT 
    'TASA_APROBACION_HOY',
    ROUND(
        CASE 
            WHEN COUNT(*) > 0 THEN (SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*))
            ELSE 0 
        END, 2
    )
FROM transactions 
WHERE DATE(created_at) = CURDATE();

-- 20. Top 5 actividades recientes para dashboard
SELECT 
    CASE 
        WHEN table_name = 'cards' THEN CONCAT('💳 Nueva tarjeta: ', identifier)
        WHEN table_name = 'transactions' AND status = 'APPROVED' THEN CONCAT('✅ Transacción aprobada: $', total_amount)
        WHEN table_name = 'transactions' AND status = 'CANCELLED' THEN CONCAT('❌ Transacción cancelada: $', total_amount)
        ELSE 'Actividad desconocida'
    END as descripcion,
    created_at as fecha
FROM (
    SELECT 'cards' as table_name, identifier, NULL as status, NULL as total_amount, created_at FROM cards
    UNION ALL
    SELECT 'transactions' as table_name, reference_number as identifier, status, total_amount, created_at FROM transactions
) combined
ORDER BY created_at DESC
LIMIT 5;

-- ===================================================================
-- 📝 NOTAS DE USO
-- ===================================================================
/*
1. Estas consultas están optimizadas para el esquema actual del sistema
2. Algunas consultas contienen parámetros que deben ser reemplazados (fechas, documentos, etc.)
3. Para producción, considerar agregar índices en:
   - cards.status
   - cards.created_at
   - transactions.status
   - transactions.created_at
   - transactions.card_identifier
4. Las consultas de análisis pueden ser costosas en volúmenes grandes de datos
5. Considerar implementar paginación para consultas que retornen muchos resultados
*/

-- ===================================================================
-- 🔧 CONSULTAS DE MANTENIMIENTO
-- ===================================================================

-- Limpiar transacciones de prueba (¡USAR CON PRECAUCIÓN!)
-- DELETE FROM transactions WHERE purchase_address = 'TEST_MERCHANT';

-- Verificar integridad referencial
-- SELECT t.* FROM transactions t LEFT JOIN cards c ON t.card_identifier = c.identifier WHERE c.identifier IS NULL;

-- ===================================================================
-- FIN DEL ARCHIVO
-- ===================================================================