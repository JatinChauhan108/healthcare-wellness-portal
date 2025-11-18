import AuditLog from '../models/AuditLog.js';

// Audit logging middleware
export const auditLog = (action, targetResource = null) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    
    // Override send function to log after response
    res.send = function(data) {
      // Call original send
      originalSend.call(this, data);
      
      // Log audit entry (async, don't block response)
      if (req.user) {
        AuditLog.create({
          userId: req.user._id,
          action: action,
          targetResource: targetResource,
          targetId: req.params.id || req.body._id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          details: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode
          }
        }).catch(err => {
          console.error('Audit log error:', err);
        });
      }
    };
    
    next();
  };
};

// Helper function to create audit log manually
export const createAuditLog = async (userId, action, details = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      ...details
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
