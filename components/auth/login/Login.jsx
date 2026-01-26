import React, { useState } from 'react';
import { USERS } from '../../../constants';
import * as S from './Login.styled';

// TODO: 이 URL을 실제 업로드하신 이미지 경로로 변경해주세요. (예: '/assets/office-bg.png')
// 현재는 분위기가 유사한 고화질 오피스 이미지를 임시로 적용했습니다.
const BACKGROUND_IMAGE_URL = "assets/MCN.png";

export const Login = ({ onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for employee
        if (id === 'qwer' && password === '1234') {
            onLogin(USERS.employee);
            return;
        }

        // Check for admin
        if (id === 'admin' && password === '1234') {
            onLogin(USERS.admin);
            return;
        }

        // Check for creator (gamedol)
        if (id === 'gamedol' && password === '1234') {
            onLogin(USERS.creator);
            return;
        }

        // Check for creator (chim)
        if (id === 'chim' && password === '1234') {
            // Need to pass an object that simulates the creator user structure
            // App.jsx will merge this with INITIAL_CREATORS data if ID matches
            onLogin({ ...USERS.creator, id: '2', name: '침착맨', username: 'chim' });
            return;
        }

        setError('아이디 또는 비밀번호를 확인해주세요.');
    };

    return (
        <S.Container style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
            <S.Overlay />

            <S.LoginCard>
                <S.Header>
                    <S.LogoBox>N</S.LogoBox>
                    <S.Title>HR Workspace</S.Title>
                    <S.SubTitle>Notion 스타일의 인사 관리 시스템</S.SubTitle>
                </S.Header>

                <S.Form onSubmit={handleSubmit}>
                    <S.FormGroup>
                        <S.Label>아이디</S.Label>
                        <S.Input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                        />
                    </S.FormGroup>
                    <S.FormGroup>
                        <S.Label>비밀번호</S.Label>
                        <S.Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </S.FormGroup>

                    {error && (
                        <S.ErrorBox>
                            <S.ErrorText>{error}</S.ErrorText>
                        </S.ErrorBox>
                    )}

                    <S.SubmitButton type="submit">
                        로그인
                    </S.SubmitButton>
                </S.Form>

                <S.Footer>
                    <S.FooterTitle>테스트 계정 정보</S.FooterTitle>
                    <S.FooterContent>
                        <S.TestAccountBadge>직원: qwer / 1234</S.TestAccountBadge>
                        <S.TestAccountBadge>관리자: admin / 1234</S.TestAccountBadge>
                        <S.TestAccountBadge>겜돌이: gamedol / 1234</S.TestAccountBadge>
                        <S.TestAccountBadge>침착맨: chim / 1234</S.TestAccountBadge>
                    </S.FooterContent>
                </S.Footer>
            </S.LoginCard>
        </S.Container>
    );
};
