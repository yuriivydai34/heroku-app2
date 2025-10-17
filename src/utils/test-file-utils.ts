import { getFileUrl } from '../utils/file-utils';

// Test cases to demonstrate the fix
console.log('Testing getFileUrl function:');

// Test with absolute URL (MinIO cloud storage)
const cloudUrl = 'http://localhost:9000/files/uploads/2025-10-17T18-33-59-242Z_dGVzdA__.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20251017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251017T183359Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=005c66047c302a91148629ed5c9f56063ff57b9a4d5dba5c4d97735990d3bacf';
console.log('Cloud URL (absolute):', getFileUrl(cloudUrl));
// Should return: http://localhost:9000/files/uploads/2025-10-17T18-33-59-242Z_dGVzdA__.txt?...

// Test with relative URL (local storage)
const localUrl = 'uploads/localfile.txt';
console.log('Local URL (relative):', getFileUrl(localUrl));
// Should return: http://localhost:3000/uploads/localfile.txt

// Test with undefined
console.log('Undefined URL:', getFileUrl(undefined));
// Should return: ''