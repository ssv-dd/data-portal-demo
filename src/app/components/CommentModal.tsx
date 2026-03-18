import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { MessageSquare, Send, AtSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  onSubmitComment: (comment: string, mentions: string[], selectedText: string) => void;
}

// Mock team members for @mentions
const teamMembers = [
  { id: '1', name: 'Sarah Chen', role: 'Data Engineering Lead', avatar: 'SC' },
  { id: '2', name: 'James Park', role: 'Payments Team', avatar: 'JP' },
  { id: '3', name: 'Abde Tambawala', role: 'Strategy & Operations', avatar: 'AT' },
  { id: '4', name: 'Mike Torres', role: 'Analytics Manager', avatar: 'MT' },
  { id: '5', name: 'Lisa Wong', role: 'Product Manager', avatar: 'LW' }
];

export function CommentModal({
  open,
  onOpenChange,
  selectedText,
  onSubmitComment
}: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');

  const handleCommentChange = (value: string) => {
    setComment(value);

    // Detect @ symbol for mentions
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
    // Remove the @ and search term, add the mention
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            Add Comment
          </DialogTitle>
          <DialogDescription>
            Tag team members and start a discussion about this insight
          </DialogDescription>
        </DialogHeader>

        {/* Selected Text Preview */}
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Commenting on:</p>
          <p className="text-sm font-medium line-clamp-3">"{selectedText}"</p>
        </div>

        {/* Comment Input */}
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              placeholder="Type @ to mention team members..."
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              className="min-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />

            {/* @Mention Dropdown */}
            <AnimatePresence>
              {showMentionDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-purple-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10"
                >
                  {filteredMembers.length > 0 ? (
                    <div className="p-1">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          className="w-full flex items-center gap-3 p-2 rounded hover:bg-purple-50 text-left transition-colors"
                          onClick={() => handleMentionSelect(member)}
                        >
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">
                            {member.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No team members found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mentioned Users */}
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <p className="text-xs text-muted-foreground w-full">Tagged:</p>
              {mentions.map((mentionId) => {
                const member = teamMembers.find(m => m.id === mentionId);
                if (!member) return null;
                return (
                  <Badge key={mentionId} variant="secondary" className="gap-1">
                    @{member.name}
                    <button
                      onClick={() => setMentions(mentions.filter(id => id !== mentionId))}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              <AtSign className="h-3 w-3 inline mr-1" />
              Type @ to mention team members
            </p>
            <div className="flex gap-2">
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
                className="gap-1 bg-orange-600 hover:bg-orange-700"
              >
                <Send className="h-3.5 w-3.5" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
