import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Send, AtSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { TeamMember } from '@/types/ai';

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  onSubmitComment: (comment: string, mentions: string[], selectedText: string) => void;
  teamMembers: TeamMember[];
}

const PreviewBox = styled.div`
  padding: ${Theme.usage.space.small};
  background-color: var(--app-status-warning-bg-light);
  border: 1px solid #fed7aa;
  border-radius: ${radius.xl};
`;

const PreviewLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const PreviewText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const MentionDropdown = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: ${Theme.usage.space.xSmall};
  background: ${colors.white};
  border: 2px solid ${colors.purple200};
  border-radius: ${radius.xl};
  box-shadow: 0 10px 15px -3px rgb(var(--app-overlay-rgb) / 0.1), 0 4px 6px -4px rgb(var(--app-overlay-rgb) / 0.1);
  max-height: 192px;
  overflow-y: auto;
  z-index: 10;
`;

const MentionList = styled.div`
  padding: ${Theme.usage.space.xxSmall};
`;

const MentionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.purple50};
  }
`;

const MentionAvatar = styled.div`
  height: 32px;
  width: 32px;
  border-radius: ${Theme.usage.borderRadius.full};
  background-color: ${colors.purple100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.purple700};
`;

const MentionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MentionName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MentionRole = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyMention = styled.div`
  padding: ${Theme.usage.space.small};
  text-align: center;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const TaggedSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${Theme.usage.space.xSmall};
`;

const TaggedLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  width: 100%;
`;

const RemoveMentionBtn = styled.button`
  margin-left: ${Theme.usage.space.xxSmall};
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: ${Theme.usage.borderRadius.full};

  &:hover {
    background-color: ${colors.muted};
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${Theme.usage.space.xSmall};
  border-top: 1px solid ${colors.border};
`;

const HintText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
`;

export function CommentModal({
  open,
  onOpenChange,
  selectedText,
  onSubmitComment,
  teamMembers
}: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');

  const handleCommentChange = (value: string) => {
    setComment(value);

    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentionDropdown(true);
      setMentionSearch('');
    } else if (lastAtIndex !== -1) {
      const searchTerm = value.slice(lastAtIndex + 1);
      if (!searchTerm.includes(' ')) {
        setShowMentionDropdown(true);
        setMentionSearch(searchTerm);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMentionSelect = (member: typeof teamMembers[0]) => {
    const lastAtIndex = comment.lastIndexOf('@');
    const newComment = comment.slice(0, lastAtIndex) + `@${member.name} `;
    setComment(newComment);
    setMentions([...mentions, member.id]);
    setShowMentionDropdown(false);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmitComment(comment, mentions, selectedText);
      setComment('');
      setMentions([]);
      onOpenChange(false);
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add Comment">
      <DialogContent style={{ maxWidth: '512px' }}>
          <DialogDescription>
            Tag team members and start a discussion about this insight
          </DialogDescription>

        <PreviewBox>
          <PreviewLabel>Commenting on:</PreviewLabel>
          <PreviewText>"{selectedText}"</PreviewText>
        </PreviewBox>

        <CommentSection>
          <InputWrapper>
            <Textarea
              placeholder="Type @ to mention team members..."
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              style={{ minHeight: '100px', resize: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />

            <AnimatePresence>
              {showMentionDropdown && (
                <MentionDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {filteredMembers.length > 0 ? (
                    <MentionList>
                      {filteredMembers.map((member) => (
                        <MentionButton
                          key={member.id}
                          onClick={() => handleMentionSelect(member)}
                        >
                          <MentionAvatar>
                            {member.avatar}
                          </MentionAvatar>
                          <MentionInfo>
                            <MentionName>{member.name}</MentionName>
                            <MentionRole>{member.role}</MentionRole>
                          </MentionInfo>
                        </MentionButton>
                      ))}
                    </MentionList>
                  ) : (
                    <EmptyMention>
                      No team members found
                    </EmptyMention>
                  )}
                </MentionDropdown>
              )}
            </AnimatePresence>
          </InputWrapper>

          {mentions.length > 0 && (
            <TaggedSection>
              <TaggedLabel>Tagged:</TaggedLabel>
              {mentions.map((mentionId) => {
                const member = teamMembers.find(m => m.id === mentionId);
                if (!member) return null;
                return (
                  <Badge key={mentionId} variant="secondary" style={{ gap: '4px' }}>
                    @{member.name}
                    <RemoveMentionBtn
                      onClick={() => setMentions(mentions.filter(id => id !== mentionId))}
                    >
                      <X style={{ height: '12px', width: '12px' }} />
                    </RemoveMentionBtn>
                  </Badge>
                );
              })}
            </TaggedSection>
          )}

          <ActionBar>
            <HintText>
              <AtSign style={{ height: '12px', width: '12px', display: 'inline', marginRight: '4px' }} />
              Type @ to mention team members
            </HintText>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!comment.trim()}
                style={{ gap: '4px', backgroundColor: '#ea580c' }}
              >
                <Send style={{ height: '14px', width: '14px' }} />
                Post Comment
              </Button>
            </ButtonGroup>
          </ActionBar>
        </CommentSection>
      </DialogContent>
    </Dialog>
  );
}
