'use client';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { type XPost, ACCOUNT_TYPE_STYLE, fmt } from '@/data/mockXPosts';

const SEP  = '#e2e8f0';
const TEXT = '#0f172a';
const TEXT2 = '#475569';
const TEXT3 = '#94a3b8';

// Mock image placeholders — real images would come from URLs
const IMAGE_PLACEHOLDERS: Record<string, string> = {
  'strike-aerial-1':         '#1e293b',
  'osint-thermal-1':         '#0f4c1a',
  'osint-map-1':             '#1a237e',
  'iran-missile-1':          '#1a1a2e',
  'ukraine-column-geo-1':    '#1b2838',
  'ukraine-column-geo-2':    '#1b3a2c',
  'taiwan-radar-track-1':    '#1a1a2e',
  'uss-reagan-philippine-sea': '#082040',
};

const IMAGE_LABELS: Record<string, string> = {
  'strike-aerial-1':         'Aerial strike imagery — northern Gaza',
  'osint-thermal-1':         'Thermal satellite — strike signatures',
  'osint-map-1':             'OSINT geolocation map',
  'iran-missile-1':          'IRGC missile launch — state media footage',
  'ukraine-column-geo-1':    'Geolocated armor column — satellite',
  'ukraine-column-geo-2':    'Column composition — vehicle ID',
  'taiwan-radar-track-1':    'PLAAF track — Taiwan ADIZ',
  'uss-reagan-philippine-sea': 'USS Ronald Reagan — Philippine Sea',
};

function timeAgo(ts: string) {
  const ms = Date.now() - new Date(ts).getTime();
  if (ms < 60000)    return 'Just now';
  if (ms < 3600000)  return `${Math.round(ms / 60000)}m`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Props {
  post: XPost;
  compact?: boolean;
}

export default function XPostCard({ post, compact }: Props) {
  const acctStyle = ACCOUNT_TYPE_STYLE[post.accountType];
  const isBreaking = post.significance === 'BREAKING';

  return (
    <div style={{
      border: `1px solid ${isBreaking ? '#fca5a5' : SEP}`,
      borderLeft: `4px solid ${isBreaking ? '#dc2626' : post.verified ? '#1d4ed8' : '#94a3b8'}`,
      background: isBreaking ? '#fff5f5' : 'white',
      marginBottom: 8,
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Breaking banner */}
      {isBreaking && (
        <div style={{ padding: '4px 12px', background: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: 9, color: 'white', fontWeight: 700, letterSpacing: '0.08em' }}>BREAKING</span>
        </div>
      )}

      <div style={{ padding: compact ? '10px 12px' : '14px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: post.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: 0,
          }}>
            {post.avatar.slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{post.displayName}</span>
              {post.verified && <CheckCircle size={13} style={{ color: '#1d4ed8', flexShrink: 0 }} strokeWidth={2.5} />}
              <span style={{ fontSize: 11, color: TEXT3 }}>{post.handle}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: TEXT3, flexShrink: 0 }}>{timeAgo(post.timestamp)}</span>
            </div>
            <span style={{
              display: 'inline-block', fontSize: 9, padding: '1px 5px', borderRadius: 2,
              background: acctStyle.color + '18', color: acctStyle.color, fontWeight: 700, letterSpacing: '0.05em',
            }}>
              {acctStyle.label}
            </span>
          </div>
        </div>

        {/* Post content */}
        <p style={{
          fontSize: compact ? 12.5 : 13.5, color: TEXT, lineHeight: 1.55,
          marginBottom: 10, whiteSpace: 'pre-wrap',
          ...(compact ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
        }}>
          {post.content}
        </p>

        {/* Images */}
        {!compact && post.images && post.images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: post.images.length === 1 ? '1fr' : '1fr 1fr',
            gap: 4,
            marginBottom: 10,
          }}>
            {post.images.map(img => (
              <div key={img} style={{
                height: post.images!.length === 1 ? 160 : 100,
                background: IMAGE_PLACEHOLDERS[img] ?? '#1e293b',
                display: 'flex', alignItems: 'flex-end', padding: 8,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Fake grain overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5))',
                }} />
                <span style={{
                  position: 'relative', fontSize: 10, color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'Arial, sans-serif', lineHeight: 1.3,
                }}>
                  {IMAGE_LABELS[img] ?? img}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Video thumb */}
        {!compact && post.videoThumb && (
          <div style={{
            height: 140,
            background: '#1e293b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10, position: 'relative',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid white', marginLeft: 3 }} />
            </div>
            <span style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
              Video · {post.videoThumb.replace(/-/g, ' ')}
            </span>
          </div>
        )}

        {/* Engagement */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Metric icon="💬" val={fmt(post.replies)} />
          <Metric icon="🔁" val={fmt(post.retweets)} />
          <Metric icon="♥" val={fmt(post.likes)} />
          <Metric icon="👁" val={fmt(post.views)} />
          <div style={{ marginLeft: 'auto' }}>
            <ExternalLink size={12} style={{ color: TEXT3, cursor: 'pointer' }} strokeWidth={1.5} />
          </div>
        </div>

        {/* Pharos note */}
        {!compact && post.pharosNote && (
          <div style={{
            marginTop: 10, padding: '8px 10px',
            background: post.pharosNote.startsWith('⚠️') ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${post.pharosNote.startsWith('⚠️') ? '#fde68a' : '#bbf7d0'}`,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            {post.pharosNote.startsWith('⚠️')
              ? <AlertTriangle size={12} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
              : <CheckCircle size={12} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            }
            <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>
              <strong style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, letterSpacing: '0.05em', color: '#6b7280' }}>PHAROS NOTE · </strong>
              {post.pharosNote.replace('⚠️ ', '')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon, val }: { icon: string; val: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT3 }}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      {val}
    </span>
  );
}
