import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CalendarIcon, X, User as UserIcon, CheckCircle2 } from 'lucide-react';
import {
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
  ModalBody, ModalFooter, PrimaryButton, SecondaryButton,
  FormGroup, Label, Select, Input, TextArea
} from '../../../../shared/ui/Modal.styled';
import { creatorService } from '../../../creator/api/creatorService';
import { scheduleService } from '../../../calendar/api/scheduleService';
import { useAuthStore } from '../../../auth/model/useAuthStore';

export const ScheduleWriteModal = ({
  isOpen,
  onClose,
  date,
  initialCreatorId, // CalendarTab sends the currently viewed creator or null
  myCreators,       // List of creators managed by the logged-in manager
  onConfirm,        // Callback to refresh calendar
  editEvent         // Event to edit (null if creating new)
}) => {
  const { user } = useAuthStore();
  const [allCreators, setAllCreators] = useState([]);
  const [form, setForm] = useState({
    scheduleName: '',
    scheduleDate: date || new Date().toISOString().split('T')[0],
    scheduleDetail: '',
    scheduleType: 'CONTENT', // Default to CONTENT or PROMOTION? User example used 'PROMOTION' and 'MERGE'
    creatorId: initialCreatorId || '',
    visitorIds: []
  });
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(prev => ({
        ...prev,
        scheduleDate: date || prev.scheduleDate,
        creatorId: initialCreatorId || prev.creatorId
      }));
      fetchAllCreators();
    }
  }, [isOpen, date, initialCreatorId]);

  const fetchAllCreators = async () => {
    try {
      // Fetch all creators for the visitor selection list (for MERGE type)
      const data = await creatorService.getAllCreators();
      // list가 있으면 list, content가 있으면 content, 아니면 데이터 자체가 배열인지 확인, 그도 아니면 빈 배열
      const creators = data.list || data.content || (Array.isArray(data) ? data : []);
      setAllCreators(creators);
    } catch (error) {
      console.error('전체 크리에이터 조회 실패:', error);
    }
  };

  const potentialPartners = allCreators.filter(c => {
    const cId = String(c.creator_id || c.creatorId || c.id || c.member_id || c.memberId || c.member_no);
    const cName = c.member_name || c.memberName || c.creator_name || c.creatorName || c.member_name || c.name || '';
    return cId !== String(form.creatorId) && cName.includes(partnerSearchQuery);
  });

  const togglePartnerCreator = (creatorId) => {
    setForm(prev => {
      const id = Number(creatorId);
      const exists = prev.visitorIds.includes(id);
      return {
        ...prev,
        visitorIds: exists
          ? prev.visitorIds.filter(vid => vid !== id)
          : [...prev.visitorIds, id],
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.scheduleName || !form.creatorId) {
      toast.error('일정 제목과 담당 크리에이터를 선택해주세요.');
      return;
    }

    try {
      // Construct payload matching the user request
      const payload = {
        scheduleName: form.scheduleName,
        scheduleDate: form.scheduleDate,
        scheduleDetail: form.scheduleDetail,
        scheduleType: form.scheduleType,
        creatorId: Number(form.creatorId),
        visitorIds: form.scheduleType === 'MERGE' ? form.visitorIds : [] // Only send visitors for MERGE
      };


      const response = await scheduleService.createSchedule(payload);

      if (response) {
        toast.success('일정이 성공적으로 등록되었습니다.');
        onConfirm(); // Refresh parent
        onClose();   // Close modal

        // Reset form
        setForm({
          scheduleName: '',
          scheduleDate: new Date().toISOString().split('T')[0],
          scheduleDetail: '',
          scheduleType: 'CONTENT',
          creatorId: '',
          visitorIds: []
        });
      }
    } catch (error) {
      console.error('일정 등록 실패:', error);
      toast.error('일정 등록에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} $maxWidth="32rem">
        <ModalHeader>
          <ModalTitle>
            <CalendarIcon size={20} style={{ color: '#2563eb' }} />
            {editEvent ? '일정 수정' : '일정 등록'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {/* ... (body content remains same) ... */}
          <div className="space-y-6">
            <FormGroup>
              <Label>일정 제목</Label>
              <Input
                autoFocus
                placeholder="예: 갤럭시 S26 홍보 영상 촬영"
                value={form.scheduleName}
                onChange={e => setForm({ ...form, scheduleName: e.target.value })}
              />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <FormGroup>
                <Label>담당 크리에이터</Label>
                <Select
                  value={form.creatorId}
                  onChange={e => setForm({ ...form, creatorId: e.target.value })}
                  disabled={!!editEvent} // Disable creator change in edit mode? Usually safer.
                >
                  <option value="">선택하세요</option>
                  {myCreators.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>날짜 선택</Label>
                <Input
                  type="date"
                  value={form.scheduleDate}
                  onChange={e => setForm({ ...form, scheduleDate: e.target.value })}
                />
              </FormGroup>
            </div>

            <FormGroup>
              <Label>일정 유형</Label>
              <Select
                value={form.scheduleType}
                onChange={e => setForm({ ...form, scheduleType: e.target.value })}
              >
                <option value="CONTENT">콘텐츠 (CONTENT)</option>
                <option value="PROMOTION">광고/홍보 (PROMOTION)</option>
                <option value="MEETING">미팅 (MEETING)</option>
                <option value="MERGE">합방 (MERGE)</option>
                <option value="LIVE">라이브 (LIVE)</option>
                <option value="OTHER">기타 (OTHER)</option>
              </Select>
            </FormGroup>

            {form.scheduleType === 'MERGE' && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 animate-[fadeIn_0.2s_ease-out]" style={{ backgroundColor: '#faf5ff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #f3e8ff' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', marginBottom: '0.75rem' }}>
                  <UserIcon size={14} /> 합방 참여 크리에이터 선택
                </h4>

                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <Input
                    placeholder="이름으로 검색..."
                    value={partnerSearchQuery}
                    onChange={e => setPartnerSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                  <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#d8b4fe' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>

                <div style={{ maxHeight: '140px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {potentialPartners.length > 0 ? potentialPartners.map(creator => {
                    const rawId = creator.creator_id || creator.creatorId || creator.id || creator.member_id || creator.memberId || creator.member_no;
                    const creatorId = Number(rawId);
                    const isSelected = form.visitorIds.includes(creatorId);
                    const avatarUrl = creator.profile_image || creator.profileImage || '';
                    const creatorName = creator.member_name || creator.memberName || creator.creator_name || creator.creatorName || creator.name || '이름 없음';
                    return (
                      <div
                        key={creatorId}
                        onClick={() => togglePartnerCreator(creatorId)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderRadius: '0.5rem',
                          cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                          backgroundColor: isSelected ? 'white' : 'transparent',
                          borderColor: isSelected ? '#e9d5ff' : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                            {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? 700 : 400, color: isSelected ? '#581c87' : '#4b5563' }}>
                            {creatorName}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 size={16} color="#9333ea" />}
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>검색 결과가 없습니다.</div>
                  )}
                </div>
              </div>
            )}

            <FormGroup>
              <Label>상세 내용</Label>
              <TextArea
                rows={3}
                placeholder="상세 정보를 입력하세요"
                value={form.scheduleDetail}
                onChange={e => setForm({ ...form, scheduleDetail: e.target.value })}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter>
          <SecondaryButton onClick={onClose}>취소</SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>
            {editEvent ? '수정 완료' : '등록 완료'}
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
