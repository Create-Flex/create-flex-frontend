import React, { useState } from 'react';
import { Users, Grid, Monitor, Link, AtSign, Building, Briefcase, UserCircle, Mail, Calendar, Pencil, Lock } from 'lucide-react';
import { SectionTitle } from '../ProfileView.styled';
import {
    InfoContainer, SectionHeader, SubSectionHeader, InfoRow, InfoIconWrapper, InfoLabel, InfoValue,
    InfoText, InfoTextBold, InfoTextMedium, SubLabel, ContactList, ContactItem, ContactLabel,
    EditButtonGroup, InfoAnimationWrapper, JoinDateWrapper, ContactInfoWrapper, ContactRow,
    EditFormGrid, InputGroup, Label, Input, EditButton, PasswordButton,
    EditActions, Spacer, MarginLeft
} from './ProfileInfo.styled';

export const ProfileInfo = ({
    profile,
    isCreator,
    readOnly,
    onUpdateProfile,
    onPasswordChangeClick
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (field, value) => {
        onUpdateProfile({
            ...profile,
            [field]: value
        });
    };

    return (
        <div>
            <SectionHeader>
                <SectionTitle>기본 정보</SectionTitle>
            </SectionHeader>
            <InfoContainer>
                {isCreator ? (
                    <>
                        <InfoRow>
                            <InfoIconWrapper><Users size={18} /></InfoIconWrapper>
                            <InfoLabel $wide>구독자</InfoLabel>
                            <InfoValue>
                                <InfoTextBold>{profile.subscribers}</InfoTextBold>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Grid size={18} /></InfoIconWrapper>
                            <InfoLabel $wide>카테고리</InfoLabel>
                            <InfoValue>{profile.category}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Monitor size={18} /></InfoIconWrapper>
                            <InfoLabel $wide>크리에이터 플랫폼</InfoLabel>
                            <InfoValue>{profile.platform}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Link size={18} /></InfoIconWrapper>
                            <InfoLabel $wide>매니저 이름</InfoLabel>
                            <InfoValue><InfoTextMedium>{profile.manager}</InfoTextMedium></InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><AtSign size={18} /></InfoIconWrapper>
                            <InfoLabel $wide>연락처</InfoLabel>
                            <InfoValue>
                                <SubLabel>이메일</SubLabel>
                                <span>{profile.email}</span>
                            </InfoValue>
                        </InfoRow>
                    </>
                ) : (
                    <>
                        <InfoRow $alignStart>
                            <InfoIconWrapper $marginTop><Building size={16} /></InfoIconWrapper>
                            <InfoLabel>조직</InfoLabel>
                            <InfoValue>
                                <InfoText>
                                    <SubLabel>소속</SubLabel> {profile.org}
                                </InfoText>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow $alignStart>
                            <InfoIconWrapper $marginTop><Briefcase size={16} /></InfoIconWrapper>
                            <InfoLabel>직무</InfoLabel>
                            <InfoValue>
                                <InfoText>
                                    <SubLabel>수행 직무</SubLabel> {profile.job}
                                </InfoText>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow $alignStart>
                            <InfoIconWrapper $marginTop><UserCircle size={16} /></InfoIconWrapper>
                            <InfoLabel>연락처</InfoLabel>
                            <InfoValue>
                                <ContactList>
                                    <ContactItem>
                                        <ContactLabel>이메일</ContactLabel>
                                        <span>{profile.email}</span>
                                    </ContactItem>
                                </ContactList>
                            </InfoValue>
                        </InfoRow>
                    </>
                )}
            </InfoContainer>

            {!isCreator && (
                <div>
                    <SubSectionHeader>
                        <SectionTitle style={{ marginBottom: 0, marginTop: '0.25rem' }}>개인정보</SectionTitle>
                        {!readOnly && (
                            <EditActions>
                                <EditButton
                                    $active={isEditing}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <Pencil size={12} /> {isEditing ? '저장' : '정보 수정'}
                                </EditButton>
                                <PasswordButton onClick={onPasswordChangeClick}>
                                    <Lock size={12} /> 비밀번호 변경
                                </PasswordButton>
                            </EditActions>
                        )}
                    </SubSectionHeader>

                    <InfoContainer>
                        {!readOnly && (
                            <InfoRow $alignStart>
                                <InfoIconWrapper $marginTop><UserCircle size={18} /></InfoIconWrapper>
                                <InfoLabel $paddingTop>이름</InfoLabel>
                                <InfoValue>
                                    {isEditing ? (
                                        <EditFormGrid>
                                            <InputGroup>
                                                <Label>본명</Label>
                                                <Input
                                                    value={profile.name}
                                                    onChange={(e) => handleChange('name', e.target.value)}
                                                />
                                            </InputGroup>
                                            <InputGroup>
                                                <Label>영문 이름</Label>
                                                <Input
                                                    value={profile.engName}
                                                    onChange={(e) => handleChange('engName', e.target.value)}
                                                />
                                            </InputGroup>
                                        </EditFormGrid>
                                    ) : (
                                        <InfoAnimationWrapper>
                                            <SubLabel>본명</SubLabel> {profile.name}
                                            <Spacer><SubLabel>영문 이름</SubLabel> {profile.engName}</Spacer>
                                        </InfoAnimationWrapper>
                                    )}
                                </InfoValue>
                            </InfoRow>
                        )}
                        <InfoRow $alignStart>
                            <InfoIconWrapper $marginTop><Mail size={16} /></InfoIconWrapper>
                            <InfoLabel $paddingTop>연락처</InfoLabel>
                            <InfoValue>
                                {isEditing && !readOnly ? (
                                    <EditFormGrid>
                                        <InputGroup>
                                            <Label>개인 이메일</Label>
                                            <Input
                                                value={profile.personalEmail}
                                                onChange={(e) => handleChange('personalEmail', e.target.value)}
                                            />
                                        </InputGroup>
                                        <InputGroup>
                                            <Label>휴대전화</Label>
                                            <Input
                                                value={profile.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                            />
                                        </InputGroup>
                                    </EditFormGrid>
                                ) : (
                                    <ContactInfoWrapper>
                                        <ContactRow>
                                            <ContactLabel>개인 이메일</ContactLabel> {profile.personalEmail}
                                        </ContactRow>
                                        <ContactRow>
                                            <ContactLabel>휴대전화</ContactLabel> {profile.phone}
                                        </ContactRow>
                                    </ContactInfoWrapper>
                                )}
                            </InfoValue>
                        </InfoRow>
                        {!readOnly && (
                            <InfoRow $alignStart>
                                <InfoIconWrapper $marginTop><Calendar size={16} /></InfoIconWrapper>
                                <InfoLabel $paddingTop>입사 정보</InfoLabel>
                                <InfoValue>
                                    <JoinDateWrapper>
                                        <SubLabel>입사일</SubLabel> {profile.joinDate}
                                        <MarginLeft><SubLabel>입사 유형</SubLabel> 경력</MarginLeft>
                                    </JoinDateWrapper>
                                </InfoValue>
                            </InfoRow>
                        )}
                    </InfoContainer>
                </div>
            )}
        </div>
    );
};
