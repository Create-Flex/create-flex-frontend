import { authService } from '../../features/auth/api/authService';
import { creatorService } from '../../features/creator/api/creatorService';

const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // 토큰으로 사용자 정보 가져오기
                    const userInfo = await authService.getMyInfo();

                    // Normalize user object: ensure 'id' exists for permission checks
                    const authUser = {
                        ...userInfo,
                        id: userInfo.memberId || userInfo.id
                    };
                    login(authUser, token);

                    const DEFAULT_AVATAR = 'https://i.postimg.cc/bJSGpBqg/Gemini-Generated-Image-s33rl9s33rl9s33r-(1).png';

                    const checkImage = async (url) => {
                        try {
                            const res = await fetch(url, { method: 'HEAD' });
                            return res.ok ? url : DEFAULT_AVATAR;
                        } catch {
                            return DEFAULT_AVATAR;
                        }
                    };

                    // 프로필 설정 (백엔드 데이터만 사용)
                    let newProfile = null;
                    if (userInfo.memberRole === 'ADMINISTRATOR' || userInfo.role === 'ADMINISTRATOR') {
                        // 관리자 - DTO 매핑
                        newProfile = {
                            // 공통 정보
                            employeeId: String(userInfo.memberId),
                            name: userInfo.memberName,
                            email: userInfo.corporEmail || userInfo.memberAccount,
                            role: userInfo.memberRole,
                            avatarUrl: await checkImage(userInfo.profileImage),
                            coverUrl: userInfo.profileBanner || '',
                            // 직원 상세 정보
                            job: userInfo.task || '-',
                            nickname: userInfo.nickname || '',
                            org: userInfo.departmentName || '-',
                            engName: userInfo.engName || '',
                            personalEmail: userInfo.personalEmail || '',
                            phone: userInfo.personalCall || '',
                            joinDate: userInfo.hireDate || '',
                            address: userInfo.address || '',
                            vacationRemainder: userInfo.vacationRemainder || 0,
                            rank: '관리자'
                        };
                    } else if (userInfo.memberRole === 'CREATOR' || userInfo.role === 'CREATOR') {
                        // 크리에이터 상세 정보 조회
                        try {
                            const creatorInfo = await creatorService.getCreatorById(userInfo.memberId);
                            newProfile = {
                                employeeId: String(userInfo.memberId),
                                name: creatorInfo.member_name || userInfo.memberName,
                                email: creatorInfo.member_account || userInfo.memberAccount,
                                role: 'CREATOR',
                                avatarUrl: await checkImage(creatorInfo.profileImage),
                                coverUrl: creatorInfo.profile_banner || userInfo.profileBanner || '',
                                job: 'Creator',
                                org: 'MCN',
                                rank: '-',
                                // 크리에이터 전용 필드
                                subscribers: creatorInfo.creator_subscribe || '',
                                category: creatorInfo.creator_category || '',
                                platform: creatorInfo.creator_platform || '',
                                managerName: creatorInfo.manager_name || '',
                                creatorStatus: creatorInfo.creator_status || '',
                            };
                        } catch (creatorError) {
                            console.error('크리에이터 상세 정보 조회 실패:', creatorError);
                            // 기본 프로필로 설정
                            newProfile = {
                                name: userInfo.memberName || userInfo.name,
                                job: 'Creator',
                                org: 'MCN',
                                rank: '-',
                                avatarUrl: await checkImage(userInfo.profileImage),
                                coverUrl: userInfo.profileBanner || '',
                                employeeId: userInfo.memberId || userInfo.id,
                            };
                        }
                    } else {
                        // 일반 직원 (General Employee) - DTO 매핑
                        newProfile = {
                            // 공통 정보
                            employeeId: String(userInfo.memberId),
                            name: userInfo.memberName,
                            email: userInfo.corporEmail || userInfo.memberAccount,
                            role: userInfo.memberRole,
                            avatarUrl: await checkImage(userInfo.profileImage),
                            coverUrl: userInfo.profileBanner || '',
                            // 직원 상세 정보
                            job: userInfo.task || '-',
                            nickname: userInfo.nickname || '',
                            org: userInfo.departmentName || '-',
                            engName: userInfo.engName || '',
                            personalEmail: userInfo.personalEmail || '',
                            phone: userInfo.personalCall || '',
                            joinDate: userInfo.hireDate || '',
                            address: userInfo.address || '',
                            vacationRemainder: userInfo.vacationRemainder || 0,
                            rank: '사원'
                        };
                    }
                    setUserProfile(newProfile);
                } catch (error) {
                    console.error('토큰 검증 실패:', error);
                    logout();
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
            setIsLoading(false);
        };