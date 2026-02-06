import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, User, MoreHorizontal, Edit3, Trash2, Link as LinkIcon } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';
import { creatorService } from '../../../api/creatorService';
import { useCreatorStore } from '../../../stores/useCreatorStore';
import { mapCreatorFromBackend } from '../../../utils/creatorMapper';
import {
    Container, ControlBar, SearchGroup, SearchWrapper, SearchIconWrapper, SearchInput, Divider, CountText, AddButton,
    TableWrapper, Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
    DropdownMenu, MenuButton, ActionButton,
    InfoWrapper, AvatarImg, AvatarCreating, NameText, SubText,
    ChannelWrapper, ChannelName, SubscriberCount,
    ContactText, NoDataText, ManagerName, ConnectedBadge, StatusBadge
} from './CreatorList.styled';

export const CreatorList = ({
    onOpenAddModal,
    onOpenEditModal,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuRef = useRef(null);

    const { creators, setCreators, removeCreator, setLoading, isLoading } = useCreatorStore();

    // 크리에이터 목록 조회
    const fetchCreators = async (name = null) => {
        setLoading(true);
        try {
            const response = await creatorService.getAllCreators(name);
            console.log('받아온 크리에이터 데이터:', response);

            const mappedCreators = Array.isArray(response)
                ? response.map(mapCreatorFromBackend)
                : [];

            console.log('변환된 크리에이터 데이터:', mappedCreators);
            setCreators(mappedCreators);
        } catch (error) {
            console.error('크리에이터 목록 조회 실패:', error);
            setCreators([]);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 목록 조회
    useEffect(() => {
        fetchCreators();
    }, []);

    // 검색어 변경 시 디바운싱
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchCreators(searchQuery.trim());
            } else {
                fetchCreators();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 크리에이터 삭제
    const handleDeleteCreator = async (creatorId) => {
        if (!confirm('정말 이 크리에이터를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await creatorService.deleteCreator(creatorId);
            toast.success(response.message || '크리에이터가 삭제되었습니다.');
            removeCreator(creatorId);
            setActiveMenuId(null);
        } catch (error) {
            console.error('크리에이터 삭제 실패:', error);
            toast.error(error.response?.data?.message || '크리에이터 삭제에 실패했습니다.');
        }
    };

    const filteredCreators = creators.filter(c =>
        c.name.includes(searchQuery) ||
        c.channelName?.includes(searchQuery)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Container>
            <ControlBar>
                <SearchGroup>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <Search size={14} />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="크리에이터 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchWrapper>
                    <Divider />
                    <CountText>총 {creators.length}명</CountText>
                </SearchGroup>
                <AddButton onClick={onOpenAddModal}>
                    <Plus size={16} /> 등록
                </AddButton>
            </ControlBar>
            <TableWrapper>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>크리에이터</TableHeader>
                            <TableHeader>채널 정보</TableHeader>
                            <TableHeader>연락처</TableHeader>
                            <TableHeader>담당 매니저</TableHeader>
                            <TableHeader>상태</TableHeader>
                            <TableHeader $center>관리</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredCreators.map(creator => (
                            <TableRow
                                key={creator.id}
                                onClick={() => onOpenEditModal(creator)}
                            >
                                <TableCell>
                                    <InfoWrapper>
                                        {creator.avatarUrl ? (
                                            <AvatarImg src={creator.avatarUrl} alt="" />
                                        ) : (
                                            <AvatarCreating>
                                                <User size={20} />
                                            </AvatarCreating>
                                        )}
                                        <div>
                                            <NameText>{creator.name}</NameText>
                                            <SubText>ID: {creator.loginId || creator.id}</SubText>
                                        </div>
                                    </InfoWrapper>
                                </TableCell>
                                <TableCell>
                                    <ChannelWrapper>
                                        {renderPlatformIcon(creator.platform, 12)}
                                        <ChannelName>{creator.channelName}</ChannelName>
                                    </ChannelWrapper>
                                    <SubscriberCount>구독자 {creator.subscribers}</SubscriberCount>
                                </TableCell>
                                <TableCell>
                                    {creator.contactInfo ? (
                                        <ContactText>{creator.contactInfo}</ContactText>
                                    ) : (
                                        <NoDataText>-</NoDataText>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <ManagerName>{creator.manager}</ManagerName>
                                        {creator.manager && creator.manager !== '담당자 없음' ? (
                                            <ConnectedBadge>
                                                <LinkIcon size={8} />
                                                <span>연결됨</span>
                                            </ConnectedBadge>
                                        ) : (
                                            <SubText style={{ marginTop: '0.125rem' }}>미배정</SubText>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge $status={creator.status}>
                                        {creator.status}
                                    </StatusBadge>
                                </TableCell>
                                <TableCell $center $relative onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                        $active={activeMenuId === creator.id}
                                        onClick={() => setActiveMenuId(activeMenuId === creator.id ? null : creator.id)}
                                    >
                                        <MoreHorizontal size={16} />
                                    </ActionButton>

                                    {activeMenuId === creator.id && (
                                        <DropdownMenu ref={menuRef}>
                                            <MenuButton onClick={() => {
                                                setActiveMenuId(null);
                                                onOpenEditModal(creator);
                                            }}>
                                                <Edit3 size={12} /> 정보 수정
                                            </MenuButton>
                                            <MenuButton $danger onClick={() => handleDeleteCreator(creator.id)}>
                                                <Trash2 size={12} /> 삭제
                                            </MenuButton>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableWrapper>
        </Container>
    );
};