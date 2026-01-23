import React, { useState } from 'react';
import { ProfileView } from './ProfileView';
import { Search, Users, Mail, Phone, MoreHorizontal, Hash, ChevronLeft, ArrowRight, Monitor } from 'lucide-react';

export const TeamView = ({ user, teams, employees, vacationLogs = [], creators = [] }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Find the team(s) the current user belongs to
    const myTeams = teams.filter(team => team.memberIds.includes(user.id));

    // Helper to convert Employee to UserProfile for display
    const mapEmployeeToProfile = (emp) => ({
        name: emp.name,
        engName: emp.engName,
        nickname: emp.nickname || emp.name,
        email: emp.email,
        personalEmail: emp.personalEmail || `${emp.id.toLowerCase()}@gmail.com`,
        phone: emp.phone,
        employeeId: emp.id,
        joinDate: emp.joinDate,
        tenure: '계산 필요',
        groupJoinDate: emp.joinDate,
        org: emp.dept,
        job: emp.role,
        rank: emp.rank || '직급 정보 없음',
        avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${emp.name}&background=random`,
        coverUrl: emp.coverUrl
    });

    // Helper to convert Creator to UserProfile for display
    const mapCreatorToProfile = (creator) => ({
        name: creator.name,
        engName: '',
        nickname: creator.name,
        email: creator.contactInfo || '-',
        personalEmail: `${creator.loginId || creator.name.toLowerCase()}@gmail.com`,
        phone: creator.contactInfo || '-',
        employeeId: creator.id,
        joinDate: creator.managementStartDate || '-',
        tenure: '파트너',
        groupJoinDate: '-',
        org: creator.platform, // Map Platform to Org
        job: creator.category || 'Creator', // Map Category to Job
        rank: 'Creator',
        avatarUrl: creator.avatarUrl || '',
        coverUrl: creator.coverUrl
    });

    // Level 3: Profile Detail
    if (selectedMember) {
        const isCreator = selectedMember.job === 'Creator' || selectedMember.rank === 'Creator';
        return (
            <ProfileView
                profile={selectedMember}
                onUpdateProfile={() => { }}
                readOnly={true}
                onBack={() => setSelectedMember(null)}
                vacationLogs={vacationLogs}
                isCreator={isCreator}
                hideVacationWidget={true}
                hideTasks={true} // Only hide tasks when viewing through Team Status
            />
        );
    }

    // Level 2: Team Members Detail
    if (selectedTeam) {
        const teamMemberIds = selectedTeam.memberIds;

        // Combine Employees and Creators
        const teamMembers = teamMemberIds.map(id => {
            const emp = employees.find(e => e.id === id);
            if (emp) return { ...emp, type: 'employee' };

            const creator = creators.find(c => c.id === id);
            if (creator) {
                // Normalize Creator to a shape similar to Employee for display
                return {
                    id: creator.id,
                    name: creator.name,
                    engName: '',
                    nickname: creator.name,
                    role: creator.category || 'Creator', // Display Category as Role
                    rank: creator.platform, // Display Platform as Rank
                    dept: 'MCN',
                    workStatus: creator.status === '활동중' ? '출근' : '퇴근', // Map Status
                    email: creator.contactInfo || '-',
                    phone: creator.contactInfo || '-',
                    avatarUrl: creator.avatarUrl,
                    coverUrl: creator.coverUrl,
                    type: 'creator'
                };
            }
            return null;
        }).filter((item) => item !== null);

        const filteredMembers = teamMembers.filter(member =>
            member.name.includes(searchQuery) ||
            member.role.includes(searchQuery) ||
            (member.nickname && member.nickname.includes(searchQuery))
        );

        const handleMemberClick = (member) => {
            if (member.type === 'creator') {
                // Find original creator object to map correctly
                const originalCreator = creators.find(c => c.id === member.id);
                if (originalCreator) setSelectedMember(mapCreatorToProfile(originalCreator));
            } else {
                // Find original employee object
                const originalEmp = employees.find(e => e.id === member.id);
                if (originalEmp) setSelectedMember(mapEmployeeToProfile(originalEmp));
            }
        };

        return (
            <div className="flex-1 h-screen overflow-y-auto bg-white p-8 animate-[fadeIn_0.2s_ease-out]">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <button
                                onClick={() => { setSelectedTeam(null); setSearchQuery(''); }}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 w-fit group"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                <span className="font-medium">팀 목록으로 돌아가기</span>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                                {selectedTeam.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {selectedTeam.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative group">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="이름, 직무 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content: Card Grid only */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => handleMemberClick(member)}
                                className="group border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white h-full flex flex-col"
                            >
                                <div className="h-24 bg-gray-50 relative overflow-hidden shrink-0">
                                    {member.coverUrl ? (
                                        <img src={member.coverUrl} alt="cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-gray-100"></div>
                                    )}
                                </div>
                                <div className="px-5 pb-6 pt-14 relative flex-1 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-white">
                                        {member.avatarUrl ? (
                                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xl font-bold text-gray-400">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center w-full">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                            {member.name}
                                            {member.type === 'creator' && <Monitor size={14} className="text-purple-500" />}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-3 truncate px-2">{member.role}</p>
                                        <div className="flex justify-center items-center gap-2 mt-auto">
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded border border-gray-200 font-medium truncate max-w-[80px]">
                                                {member.nickname || member.name}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${member.workStatus === '출근' ? 'bg-green-50 text-green-600 border-green-100' :
                                                member.type === 'creator' && member.workStatus === '활동중' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    'bg-gray-50 text-gray-500 border-gray-100'
                                                }`}>
                                                {member.workStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Level 1: Team List (Empty State or List)
    if (myTeams.length === 0) {
        return (
            <div className="flex-1 h-screen flex items-center justify-center bg-white">
                <div className="text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <h2 className="text-lg font-bold text-gray-700 mb-1">소속된 팀이 없습니다.</h2>
                    <p className="text-sm">관리자에게 팀 배정을 요청해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-white p-8">
            <div className="max-w-[1600px] mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Users className="text-gray-800" size={32} /> 팀 현황
                    </h1>
                    <p className="text-sm text-gray-500">
                        소속된 팀을 선택하여 구성원 정보를 확인하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.2s_ease-out]">
                    {myTeams.map(team => (
                        <div
                            key={team.id}
                            onClick={() => setSelectedTeam(team)}
                            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={64} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 border border-blue-100">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 h-10 line-clamp-2">{team.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users size={16} className="text-gray-400" />
                                        <span className="font-medium">{team.memberIds.length}명</span>
                                    </div>
                                    <div className="text-blue-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        팀원 조회 <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
